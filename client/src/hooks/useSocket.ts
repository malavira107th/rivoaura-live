import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface RoomParticipant {
  socketId: string;
  userId: number;
  userName: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isHostMuted?: boolean;
  isHost?: boolean;
  joinedAt: number;
}

export interface ChatMessage {
  id: string;
  userId: number;
  userName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface ModerationNotice {
  type: string;
  message: string;
  timestamp: number;
}

interface UseSocketOptions {
  eventId: string | null;
  enabled: boolean;
}

export function useSocket({ eventId, enabled }: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [hostUserId, setHostUserId] = useState<number | null>(null);
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [moderationNotice, setModerationNotice] = useState<ModerationNotice | null>(null);
  const [wasKicked, setWasKicked] = useState(false);

  useEffect(() => {
    if (!enabled || !eventId) return;

    const socket = io(window.location.origin, {
      path: "/api/socket.io",
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setAuthError(null);
      socket.emit("join_room", { eventId });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("auth_error", ({ message }: { message: string }) => {
      setAuthError(message);
    });

    socket.on("room_state", ({
      participants: p,
      chatHistory,
      hostUserId: hId,
      myUserId: mId,
    }: {
      participants: RoomParticipant[];
      chatHistory: ChatMessage[];
      hostUserId?: number;
      myUserId: number;
    }) => {
      setParticipants(p);
      setMessages(chatHistory);
      if (hId) setHostUserId(hId);
      setMyUserId(mId);
    });

    socket.on("user_joined", ({ participant, systemMessage }: { participant: RoomParticipant; participantCount: number; systemMessage?: ChatMessage }) => {
      setParticipants(prev => {
        const filtered = prev.filter(p => p.userId !== participant.userId);
        return [...filtered, participant];
      });
      if (systemMessage) {
        setMessages(prev => [...prev.slice(-199), systemMessage]);
      }
    });

    socket.on("user_left", ({ socketId, systemMessage }: { socketId: string; userId: number; userName: string; participantCount: number; wasKicked?: boolean; systemMessage?: ChatMessage }) => {
      setParticipants(prev => prev.filter(p => p.socketId !== socketId));
    });

    socket.on("chat_message", (msg: ChatMessage) => {
      setMessages(prev => [...prev.slice(-199), msg]);
    });

    socket.on("participant_updated", ({ socketId, isMuted, isSpeaking, isHostMuted }: { socketId: string; isMuted: boolean; isSpeaking: boolean; isHostMuted?: boolean }) => {
      setParticipants(prev =>
        prev.map(p => p.socketId === socketId ? { ...p, isMuted, isSpeaking, isHostMuted: isHostMuted ?? p.isHostMuted } : p)
      );
    });

    // Moderation events
    socket.on("moderation_notice", ({ type, message }: { type: string; message: string }) => {
      setModerationNotice({ type, message, timestamp: Date.now() });
      // Auto-clear after 5 seconds
      setTimeout(() => setModerationNotice(null), 5000);
    });

    socket.on("kicked_from_room", () => {
      setWasKicked(true);
    });

    return () => {
      socket.emit("leave_room");
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setParticipants([]);
      setMessages([]);
      setHostUserId(null);
      setMyUserId(null);
    };
  }, [eventId, enabled]);

  const sendMessage = useCallback((text: string) => {
    socketRef.current?.emit("chat_message", { text });
  }, []);

  const toggleMute = useCallback((isMuted: boolean) => {
    socketRef.current?.emit("toggle_mute", { isMuted });
  }, []);

  const sendSpeakingState = useCallback((isSpeaking: boolean) => {
    socketRef.current?.emit("speaking_state", { isSpeaking });
  }, []);

  // Host moderation actions
  const hostMuteUser = useCallback((targetUserId: number) => {
    socketRef.current?.emit("host_mute_user", { targetUserId });
  }, []);

  const hostUnmuteUser = useCallback((targetUserId: number) => {
    socketRef.current?.emit("host_unmute_user", { targetUserId });
  }, []);

  const hostKickUser = useCallback((targetUserId: number) => {
    socketRef.current?.emit("host_kick_user", { targetUserId });
  }, []);

  const hostMuteAll = useCallback(() => {
    socketRef.current?.emit("host_mute_all");
  }, []);

  // WebRTC signaling helpers
  const sendWebRTCOffer = useCallback((targetSocketId: string, offer: RTCSessionDescriptionInit) => {
    socketRef.current?.emit("webrtc_offer", { targetSocketId, offer });
  }, []);

  const sendWebRTCAnswer = useCallback((targetSocketId: string, answer: RTCSessionDescriptionInit) => {
    socketRef.current?.emit("webrtc_answer", { targetSocketId, answer });
  }, []);

  const sendICECandidate = useCallback((targetSocketId: string, candidate: RTCIceCandidateInit) => {
    socketRef.current?.emit("webrtc_ice_candidate", { targetSocketId, candidate });
  }, []);

  const isHost = hostUserId !== null && myUserId !== null && hostUserId === myUserId;

  return {
    socket: socketRef.current,
    isConnected,
    participants,
    messages,
    authError,
    hostUserId,
    myUserId,
    isHost,
    moderationNotice,
    wasKicked,
    sendMessage,
    toggleMute,
    sendSpeakingState,
    hostMuteUser,
    hostUnmuteUser,
    hostKickUser,
    hostMuteAll,
    sendWebRTCOffer,
    sendWebRTCAnswer,
    sendICECandidate,
  };
}
