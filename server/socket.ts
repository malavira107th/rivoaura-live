/**
 * Socket.IO server for real-time chat and WebRTC audio signaling.
 * Each watch party (event) is a Socket.IO "room".
 */
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import cookie from "cookie";
import { jwtVerify } from "jose";
import { ENV } from "./_core/env";
import { getUserByOpenId } from "./db";

// In-memory state for rooms
interface RoomParticipant {
  socketId: string;
  userId: number;
  userName: string;
  isMuted: boolean;
  isSpeaking: boolean;
  joinedAt: number;
}

interface ChatMessage {
  id: string;
  userId: number;
  userName: string;
  text: string;
  timestamp: number;
}

// Room state: eventId -> participants & chat history
const rooms = new Map<string, {
  participants: Map<string, RoomParticipant>;
  chatHistory: ChatMessage[];
}>();

// Socket -> room mapping
const socketRoomMap = new Map<string, string>();

function getOrCreateRoom(eventId: string) {
  if (!rooms.has(eventId)) {
    rooms.set(eventId, {
      participants: new Map(),
      chatHistory: [],
    });
  }
  return rooms.get(eventId)!;
}

function generateMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Authenticate socket connection using JWT from cookie */
async function authenticateSocket(socket: Socket): Promise<{ userId: number; userName: string } | null> {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies["app_session_id"]; // matches COOKIE_NAME in shared/const.ts
    if (!token) return null;

    const secret = new TextEncoder().encode(ENV.cookieSecret);
    const { payload } = await jwtVerify(token, secret);
    
    if (!payload.sub) return null;
    
    // payload.sub is the openId
    const user = await getUserByOpenId(payload.sub as string);
    if (!user) return null;

    return { userId: user.id, userName: user.name || "Anonymous" };
  } catch {
    return null;
  }
}

export function initSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    path: "/api/socket.io",
    cors: {
      origin: true,
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", async (socket) => {
    // Authenticate the user
    const authUser = await authenticateSocket(socket);
    if (!authUser) {
      socket.emit("auth_error", { message: "Please log in to join a watch party room." });
      socket.disconnect();
      return;
    }

    console.log(`[Socket] User ${authUser.userName} (${authUser.userId}) connected: ${socket.id}`);

    // ========== JOIN ROOM ==========
    socket.on("join_room", ({ eventId }: { eventId: string }) => {
      // Leave any previous room
      const prevRoom = socketRoomMap.get(socket.id);
      if (prevRoom) {
        leaveRoom(socket, prevRoom);
      }

      const room = getOrCreateRoom(eventId);
      
      // Check if user already in room (different tab)
      const existingSids = Array.from(room.participants.entries());
      for (const [sid, p] of existingSids) {
        if (p.userId === authUser.userId && sid !== socket.id) {
          room.participants.delete(sid);
          socketRoomMap.delete(sid);
        }
      }

      const participant: RoomParticipant = {
        socketId: socket.id,
        userId: authUser.userId,
        userName: authUser.userName,
        isMuted: true,
        isSpeaking: false,
        joinedAt: Date.now(),
      };

      room.participants.set(socket.id, participant);
      socketRoomMap.set(socket.id, eventId);
      socket.join(eventId);

      // Send room state to the joining user
      socket.emit("room_state", {
        participants: Array.from(room.participants.values()),
        chatHistory: room.chatHistory.slice(-100), // Last 100 messages
      });

      // Notify others
      socket.to(eventId).emit("user_joined", {
        participant,
        participantCount: room.participants.size,
      });

      console.log(`[Socket] ${authUser.userName} joined room ${eventId} (${room.participants.size} participants)`);
    });

    // ========== CHAT MESSAGE ==========
    socket.on("chat_message", ({ text }: { text: string }) => {
      const eventId = socketRoomMap.get(socket.id);
      if (!eventId) return;

      const room = rooms.get(eventId);
      if (!room) return;

      const trimmed = text.trim();
      if (!trimmed || trimmed.length > 500) return; // Max 500 chars

      const message: ChatMessage = {
        id: generateMessageId(),
        userId: authUser.userId,
        userName: authUser.userName,
        text: trimmed,
        timestamp: Date.now(),
      };

      room.chatHistory.push(message);
      // Keep only last 200 messages in memory
      if (room.chatHistory.length > 200) {
        room.chatHistory = room.chatHistory.slice(-200);
      }

      // Broadcast to everyone in room (including sender)
      io.to(eventId).emit("chat_message", message);
    });

    // ========== AUDIO: TOGGLE MUTE ==========
    socket.on("toggle_mute", ({ isMuted }: { isMuted: boolean }) => {
      const eventId = socketRoomMap.get(socket.id);
      if (!eventId) return;

      const room = rooms.get(eventId);
      if (!room) return;

      const participant = room.participants.get(socket.id);
      if (!participant) return;

      participant.isMuted = isMuted;
      if (isMuted) participant.isSpeaking = false;

      io.to(eventId).emit("participant_updated", {
        socketId: socket.id,
        isMuted,
        isSpeaking: participant.isSpeaking,
      });
    });

    // ========== WEBRTC SIGNALING ==========
    socket.on("webrtc_offer", ({ targetSocketId, offer }: { targetSocketId: string; offer: RTCSessionDescriptionInit }) => {
      io.to(targetSocketId).emit("webrtc_offer", {
        fromSocketId: socket.id,
        fromUserId: authUser.userId,
        fromUserName: authUser.userName,
        offer,
      });
    });

    socket.on("webrtc_answer", ({ targetSocketId, answer }: { targetSocketId: string; answer: RTCSessionDescriptionInit }) => {
      io.to(targetSocketId).emit("webrtc_answer", {
        fromSocketId: socket.id,
        answer,
      });
    });

    socket.on("webrtc_ice_candidate", ({ targetSocketId, candidate }: { targetSocketId: string; candidate: RTCIceCandidateInit }) => {
      io.to(targetSocketId).emit("webrtc_ice_candidate", {
        fromSocketId: socket.id,
        candidate,
      });
    });

    // ========== SPEAKING INDICATOR ==========
    socket.on("speaking_state", ({ isSpeaking }: { isSpeaking: boolean }) => {
      const eventId = socketRoomMap.get(socket.id);
      if (!eventId) return;

      const room = rooms.get(eventId);
      if (!room) return;

      const participant = room.participants.get(socket.id);
      if (!participant) return;

      participant.isSpeaking = isSpeaking;

      socket.to(eventId).emit("participant_updated", {
        socketId: socket.id,
        isMuted: participant.isMuted,
        isSpeaking,
      });
    });

    // ========== DISCONNECT ==========
    socket.on("disconnect", () => {
      const eventId = socketRoomMap.get(socket.id);
      if (eventId) {
        leaveRoom(socket, eventId);
      }
      console.log(`[Socket] User ${authUser.userName} disconnected: ${socket.id}`);
    });

    // ========== LEAVE ROOM ==========
    socket.on("leave_room", () => {
      const eventId = socketRoomMap.get(socket.id);
      if (eventId) {
        leaveRoom(socket, eventId);
      }
    });
  });

  function leaveRoom(socket: Socket, eventId: string) {
    const room = rooms.get(eventId);
    if (!room) return;

    const participant = room.participants.get(socket.id);
    room.participants.delete(socket.id);
    socketRoomMap.delete(socket.id);
    socket.leave(eventId);

    // Notify others
    socket.to(eventId).emit("user_left", {
      socketId: socket.id,
      userId: participant?.userId,
      userName: participant?.userName,
      participantCount: room.participants.size,
    });

    // Clean up empty rooms
    if (room.participants.size === 0) {
      rooms.delete(eventId);
    }
  }

  return io;
}
