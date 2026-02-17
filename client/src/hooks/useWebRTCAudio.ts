import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import type { RoomParticipant } from "./useSocket";

interface PeerConnection {
  pc: RTCPeerConnection;
  remoteStream: MediaStream;
  socketId: string;
}

interface UseWebRTCAudioOptions {
  socket: Socket | null;
  isConnected: boolean;
  participants: RoomParticipant[];
  isMuted: boolean;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export function useWebRTCAudio({ socket, isConnected, participants, isMuted }: UseWebRTCAudioOptions) {
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Map<string, PeerConnection>>(new Map());
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [micEnabled, setMicEnabled] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const speakingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get microphone access
  const enableMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      localStreamRef.current = stream;
      setMicEnabled(true);
      setMicError(null);

      // Set up audio analysis for speaking detection
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      return stream;
    } catch (err: any) {
      setMicError(err.message || "Could not access microphone");
      return null;
    }
  }, []);

  // Disable mic
  const disableMic = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (speakingIntervalRef.current) {
      clearInterval(speakingIntervalRef.current);
      speakingIntervalRef.current = null;
    }
    setMicEnabled(false);
  }, []);

  // Speaking detection
  useEffect(() => {
    if (!micEnabled || !analyserRef.current || !socket) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let wasSpeaking = false;

    speakingIntervalRef.current = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      const isSpeaking = avg > 20 && !isMuted;

      if (isSpeaking !== wasSpeaking) {
        wasSpeaking = isSpeaking;
        socket.emit("speaking_state", { isSpeaking });
      }
    }, 150);

    return () => {
      if (speakingIntervalRef.current) {
        clearInterval(speakingIntervalRef.current);
      }
    };
  }, [micEnabled, isMuted, socket]);

  // Mute/unmute local tracks
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted]);

  // Create peer connection for a remote participant
  const createPeerConnection = useCallback((remoteSocketId: string, isInitiator: boolean) => {
    if (!socket || !localStreamRef.current) return null;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    const remoteStream = new MediaStream();

    // Add local tracks
    localStreamRef.current.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current!);
    });

    // Handle remote tracks
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
      setRemoteStreams(prev => {
        const next = new Map(prev);
        next.set(remoteSocketId, remoteStream);
        return next;
      });
    };

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc_ice_candidate", {
          targetSocketId: remoteSocketId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        closePeerConnection(remoteSocketId);
      }
    };

    const peerConn: PeerConnection = { pc, remoteStream, socketId: remoteSocketId };
    peersRef.current.set(remoteSocketId, peerConn);

    if (isInitiator) {
      pc.createOffer().then(offer => {
        pc.setLocalDescription(offer);
        socket.emit("webrtc_offer", { targetSocketId: remoteSocketId, offer });
      });
    }

    return pc;
  }, [socket]);

  const closePeerConnection = useCallback((socketId: string) => {
    const peer = peersRef.current.get(socketId);
    if (peer) {
      peer.pc.close();
      peersRef.current.delete(socketId);
      setRemoteStreams(prev => {
        const next = new Map(prev);
        next.delete(socketId);
        return next;
      });
    }
  }, []);

  // Handle WebRTC signaling events
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleOffer = async ({ fromSocketId, offer }: { fromSocketId: string; fromUserId: number; fromUserName: string; offer: RTCSessionDescriptionInit }) => {
      let pc = peersRef.current.get(fromSocketId)?.pc;
      if (!pc) {
        pc = createPeerConnection(fromSocketId, false) || undefined;
        if (!pc) return;
      }
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtc_answer", { targetSocketId: fromSocketId, answer });
    };

    const handleAnswer = async ({ fromSocketId, answer }: { fromSocketId: string; answer: RTCSessionDescriptionInit }) => {
      const peer = peersRef.current.get(fromSocketId);
      if (peer) {
        await peer.pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    };

    const handleICECandidate = async ({ fromSocketId, candidate }: { fromSocketId: string; candidate: RTCIceCandidateInit }) => {
      const peer = peersRef.current.get(fromSocketId);
      if (peer) {
        await peer.pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    socket.on("webrtc_offer", handleOffer);
    socket.on("webrtc_answer", handleAnswer);
    socket.on("webrtc_ice_candidate", handleICECandidate);

    return () => {
      socket.off("webrtc_offer", handleOffer);
      socket.off("webrtc_answer", handleAnswer);
      socket.off("webrtc_ice_candidate", handleICECandidate);
    };
  }, [socket, isConnected, createPeerConnection]);

  // Connect to new participants when mic is enabled
  useEffect(() => {
    if (!micEnabled || !socket) return;

    const mySocketId = socket.id;
    participants.forEach(p => {
      if (p.socketId !== mySocketId && !p.isMuted && !peersRef.current.has(p.socketId)) {
        createPeerConnection(p.socketId, true);
      }
    });

    // Clean up peers that left
    const activeSocketIds = new Set(participants.map(p => p.socketId));
    const peersArray = Array.from(peersRef.current.keys());
    peersArray.forEach(socketId => {
      if (!activeSocketIds.has(socketId)) {
        closePeerConnection(socketId);
      }
    });
  }, [participants, micEnabled, socket, createPeerConnection, closePeerConnection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disableMic();
      const peersArray = Array.from(peersRef.current.keys());
      peersArray.forEach(closePeerConnection);
    };
  }, [disableMic, closePeerConnection]);

  return {
    micEnabled,
    micError,
    remoteStreams,
    enableMic,
    disableMic,
  };
}
