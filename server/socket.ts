/**
 * Socket.IO server for real-time chat, WebRTC audio signaling, and host moderation.
 * Each watch party (event) is a Socket.IO "room".
 */
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import cookie from "cookie";
import { jwtVerify } from "jose";
import { ENV } from "./_core/env";
import { getUserByOpenId, getEventById } from "./db";

// In-memory state for rooms
interface RoomParticipant {
  socketId: string;
  userId: number;
  userName: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isHostMuted: boolean; // Muted by host (cannot unmute themselves)
  joinedAt: number;
}

interface ChatMessage {
  id: string;
  userId: number;
  userName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean; // System messages (join/leave/moderation)
}

interface RoomState {
  participants: Map<string, RoomParticipant>;
  chatHistory: ChatMessage[];
  hostUserId: number | null; // The event creator is the host
  eventId: string;
}

// Room state: eventId -> participants & chat history
const rooms = new Map<string, RoomState>();

// Socket -> room mapping
const socketRoomMap = new Map<string, string>();

// Socket -> auth user mapping
const socketAuthMap = new Map<string, { userId: number; userName: string }>();

function getOrCreateRoom(eventId: string, hostUserId?: number) {
  if (!rooms.has(eventId)) {
    rooms.set(eventId, {
      participants: new Map(),
      chatHistory: [],
      hostUserId: hostUserId ?? null,
      eventId,
    });
  }
  return rooms.get(eventId)!;
}

function generateMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function createSystemMessage(text: string): ChatMessage {
  return {
    id: generateMessageId(),
    userId: 0,
    userName: "System",
    text,
    timestamp: Date.now(),
    isSystem: true,
  };
}

function isHost(room: RoomState, userId: number): boolean {
  return room.hostUserId === userId;
}

function getParticipantByUserId(room: RoomState, userId: number): [string, RoomParticipant] | null {
  for (const [sid, p] of Array.from(room.participants.entries())) {
    if (p.userId === userId) return [sid, p];
  }
  return null;
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

    socketAuthMap.set(socket.id, authUser);
    console.log(`[Socket] User ${authUser.userName} (${authUser.userId}) connected: ${socket.id}`);

    // ========== JOIN ROOM ==========
    socket.on("join_room", async ({ eventId }: { eventId: string }) => {
      // Leave any previous room
      const prevRoom = socketRoomMap.get(socket.id);
      if (prevRoom) {
        leaveRoom(socket, prevRoom);
      }

      // Look up the event to determine the host
      let hostUserId: number | undefined;
      try {
        const event = await getEventById(Number(eventId));
        if (event && event.createdBy) hostUserId = event.createdBy;
      } catch {
        // If event lookup fails, proceed without host info
      }

      const room = getOrCreateRoom(eventId, hostUserId);
      
      // Update host if we got it from DB and it wasn't set
      if (hostUserId && !room.hostUserId) {
        room.hostUserId = hostUserId;
      }

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
        isHostMuted: false,
        joinedAt: Date.now(),
      };

      room.participants.set(socket.id, participant);
      socketRoomMap.set(socket.id, eventId);
      socket.join(eventId);

      // Send room state to the joining user (include host info)
      socket.emit("room_state", {
        participants: Array.from(room.participants.values()).map(p => ({
          ...p,
          isHost: isHost(room, p.userId),
        })),
        chatHistory: room.chatHistory.slice(-100),
        hostUserId: room.hostUserId ?? undefined,
        myUserId: authUser.userId,
      });

      // System message for join
      const joinMsg = createSystemMessage(`${authUser.userName} joined the party`);
      room.chatHistory.push(joinMsg);
      if (room.chatHistory.length > 200) room.chatHistory = room.chatHistory.slice(-200);

      // Notify others
      socket.to(eventId).emit("user_joined", {
        participant: { ...participant, isHost: isHost(room, authUser.userId) },
        participantCount: room.participants.size,
        systemMessage: joinMsg,
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
      if (!trimmed || trimmed.length > 500) return;

      const message: ChatMessage = {
        id: generateMessageId(),
        userId: authUser.userId,
        userName: authUser.userName,
        text: trimmed,
        timestamp: Date.now(),
      };

      room.chatHistory.push(message);
      if (room.chatHistory.length > 200) {
        room.chatHistory = room.chatHistory.slice(-200);
      }

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

      // If host-muted, user cannot unmute themselves
      if (participant.isHostMuted && !isMuted) {
        socket.emit("moderation_notice", {
          type: "host_muted",
          message: "You have been muted by the host. You cannot unmute yourself.",
        });
        return;
      }

      participant.isMuted = isMuted;
      if (isMuted) participant.isSpeaking = false;

      io.to(eventId).emit("participant_updated", {
        socketId: socket.id,
        isMuted,
        isSpeaking: participant.isSpeaking,
        isHostMuted: participant.isHostMuted,
      });
    });

    // ========== HOST MODERATION: MUTE USER ==========
    socket.on("host_mute_user", ({ targetUserId }: { targetUserId: number }) => {
      const eventId = socketRoomMap.get(socket.id);
      if (!eventId) return;

      const room = rooms.get(eventId);
      if (!room) return;

      // Only host can mute others
      if (!isHost(room, authUser.userId)) {
        socket.emit("moderation_notice", {
          type: "not_host",
          message: "Only the host can mute other users.",
        });
        return;
      }

      // Cannot mute yourself
      if (targetUserId === authUser.userId) return;

      const target = getParticipantByUserId(room, targetUserId);
      if (!target) return;

      const [targetSid, targetParticipant] = target;
      targetParticipant.isMuted = true;
      targetParticipant.isSpeaking = false;
      targetParticipant.isHostMuted = true;

      // Notify the muted user
      io.to(targetSid).emit("moderation_notice", {
        type: "muted_by_host",
        message: "The host has muted your microphone.",
      });

      // System message
      const sysMsg = createSystemMessage(`${targetParticipant.userName} was muted by the host`);
      room.chatHistory.push(sysMsg);
      if (room.chatHistory.length > 200) room.chatHistory = room.chatHistory.slice(-200);

      // Broadcast updated state
      io.to(eventId).emit("participant_updated", {
        socketId: targetSid,
        isMuted: true,
        isSpeaking: false,
        isHostMuted: true,
      });
      io.to(eventId).emit("chat_message", sysMsg);

      console.log(`[Socket] Host ${authUser.userName} muted ${targetParticipant.userName} in room ${eventId}`);
    });

    // ========== HOST MODERATION: UNMUTE USER ==========
    socket.on("host_unmute_user", ({ targetUserId }: { targetUserId: number }) => {
      const eventId = socketRoomMap.get(socket.id);
      if (!eventId) return;

      const room = rooms.get(eventId);
      if (!room) return;

      if (!isHost(room, authUser.userId)) {
        socket.emit("moderation_notice", {
          type: "not_host",
          message: "Only the host can unmute other users.",
        });
        return;
      }

      const target = getParticipantByUserId(room, targetUserId);
      if (!target) return;

      const [targetSid, targetParticipant] = target;
      targetParticipant.isHostMuted = false;
      // Keep them muted but allow them to unmute themselves now
      
      // Notify the unmuted user
      io.to(targetSid).emit("moderation_notice", {
        type: "unmuted_by_host",
        message: "The host has allowed you to unmute. Click the mic button to speak.",
      });

      // System message
      const sysMsg = createSystemMessage(`${targetParticipant.userName} was unmuted by the host`);
      room.chatHistory.push(sysMsg);
      if (room.chatHistory.length > 200) room.chatHistory = room.chatHistory.slice(-200);

      io.to(eventId).emit("participant_updated", {
        socketId: targetSid,
        isMuted: targetParticipant.isMuted,
        isSpeaking: false,
        isHostMuted: false,
      });
      io.to(eventId).emit("chat_message", sysMsg);

      console.log(`[Socket] Host ${authUser.userName} unmuted ${targetParticipant.userName} in room ${eventId}`);
    });

    // ========== HOST MODERATION: KICK USER ==========
    socket.on("host_kick_user", ({ targetUserId }: { targetUserId: number }) => {
      const eventId = socketRoomMap.get(socket.id);
      if (!eventId) return;

      const room = rooms.get(eventId);
      if (!room) return;

      // Only host can kick
      if (!isHost(room, authUser.userId)) {
        socket.emit("moderation_notice", {
          type: "not_host",
          message: "Only the host can remove users from the room.",
        });
        return;
      }

      // Cannot kick yourself
      if (targetUserId === authUser.userId) return;

      const target = getParticipantByUserId(room, targetUserId);
      if (!target) return;

      const [targetSid, targetParticipant] = target;
      const targetName = targetParticipant.userName;

      // Notify the kicked user BEFORE removing them
      io.to(targetSid).emit("moderation_notice", {
        type: "kicked",
        message: "You have been removed from this watch party by the host.",
      });

      // Force disconnect the target from the room
      const targetSocket = io.sockets.sockets.get(targetSid);
      if (targetSocket) {
        // Remove from room state
        room.participants.delete(targetSid);
        socketRoomMap.delete(targetSid);
        targetSocket.leave(eventId);

        // Tell the kicked user to redirect
        targetSocket.emit("kicked_from_room", {
          message: "You have been removed from this watch party by the host.",
        });
      }

      // System message
      const sysMsg = createSystemMessage(`${targetName} was removed from the party by the host`);
      room.chatHistory.push(sysMsg);
      if (room.chatHistory.length > 200) room.chatHistory = room.chatHistory.slice(-200);

      // Notify remaining participants
      io.to(eventId).emit("user_left", {
        socketId: targetSid,
        userId: targetUserId,
        userName: targetName,
        participantCount: room.participants.size,
        wasKicked: true,
      });
      io.to(eventId).emit("chat_message", sysMsg);

      console.log(`[Socket] Host ${authUser.userName} kicked ${targetName} from room ${eventId}`);
    });

    // ========== HOST MODERATION: MUTE ALL ==========
    socket.on("host_mute_all", () => {
      const eventId = socketRoomMap.get(socket.id);
      if (!eventId) return;

      const room = rooms.get(eventId);
      if (!room) return;

      if (!isHost(room, authUser.userId)) {
        socket.emit("moderation_notice", {
          type: "not_host",
          message: "Only the host can mute all users.",
        });
        return;
      }

      // Mute everyone except the host
      for (const [sid, p] of Array.from(room.participants.entries())) {
        if (p.userId !== authUser.userId) {
          p.isMuted = true;
          p.isSpeaking = false;
          p.isHostMuted = true;

          io.to(sid).emit("moderation_notice", {
            type: "muted_by_host",
            message: "The host has muted all participants.",
          });

          io.to(eventId).emit("participant_updated", {
            socketId: sid,
            isMuted: true,
            isSpeaking: false,
            isHostMuted: true,
          });
        }
      }

      const sysMsg = createSystemMessage("Host muted all participants");
      room.chatHistory.push(sysMsg);
      if (room.chatHistory.length > 200) room.chatHistory = room.chatHistory.slice(-200);
      io.to(eventId).emit("chat_message", sysMsg);

      console.log(`[Socket] Host ${authUser.userName} muted all in room ${eventId}`);
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
        isHostMuted: participant.isHostMuted,
      });
    });

    // ========== DISCONNECT ==========
    socket.on("disconnect", () => {
      const eventId = socketRoomMap.get(socket.id);
      if (eventId) {
        leaveRoom(socket, eventId);
      }
      socketAuthMap.delete(socket.id);
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

    if (participant) {
      // System message
      const sysMsg = createSystemMessage(`${participant.userName} left the party`);
      room.chatHistory.push(sysMsg);
      if (room.chatHistory.length > 200) room.chatHistory = room.chatHistory.slice(-200);

      // Notify others
      socket.to(eventId).emit("user_left", {
        socketId: socket.id,
        userId: participant.userId,
        userName: participant.userName,
        participantCount: room.participants.size,
      });
      socket.to(eventId).emit("chat_message", sysMsg);
    }

    // Clean up empty rooms
    if (room.participants.size === 0) {
      rooms.delete(eventId);
    }
  }

  return io;
}
