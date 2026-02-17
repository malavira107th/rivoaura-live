import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface RoomParticipant {
  socketId: string;
  userId: number;
  userName: string;
  isMuted: boolean;
  isSpeaking: boolean;
  joinedAt: number;
}

export interface ChatMessage {
  id: string;
  userId: number;
  userName: string;
  text: string;
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

    socket.on("room_state", ({ participants: p, chatHistory }: { participants: RoomParticipant[]; chatHistory: ChatMessage[] }) => {
      setParticipants(p);
      setMessages(chatHistory);
    });

    socket.on("user_joined", ({ participant }: { participant: RoomParticipant; participantCount: number }) => {
      setParticipants(prev => {
        const filtered = prev.filter(p => p.userId !== participant.userId);
        return [...filtered, participant];
      });
    });

    socket.on("user_left", ({ socketId }: { socketId: string; userId: number; userName: string; participantCount: number }) => {
      setParticipants(prev => prev.filter(p => p.socketId !== socketId));
    });

    socket.on("chat_message", (msg: ChatMessage) => {
      setMessages(prev => [...prev.slice(-199), msg]);
    });

    socket.on("participant_updated", ({ socketId, isMuted, isSpeaking }: { socketId: string; isMuted: boolean; isSpeaking: boolean }) => {
      setParticipants(prev =>
        prev.map(p => p.socketId === socketId ? { ...p, isMuted, isSpeaking } : p)
      );
    });

    return () => {
      socket.emit("leave_room");
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setParticipants([]);
      setMessages([]);
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

  return {
    socket: socketRef.current,
    isConnected,
    participants,
    messages,
    authError,
    sendMessage,
    toggleMute,
    sendSpeakingState,
    sendWebRTCOffer,
    sendWebRTCAnswer,
    sendICECandidate,
  };
}
