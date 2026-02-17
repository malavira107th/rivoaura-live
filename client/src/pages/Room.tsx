/**
 * WATCH PARTY ROOM — The live experience
 * Real-time chat + audio room for a watch party event
 */
import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Send, Users, MessageSquare, ArrowLeft,
  Volume2, VolumeX, Clock, MapPin, Shield, LogOut, Copy, Check
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { useWebRTCAudio } from "@/hooks/useWebRTCAudio";
import { useCountdown } from "@/hooks/useCountdown";
import Navbar from "@/components/Navbar";

export default function Room() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Fetch event data
  const { data: event, isLoading } = trpc.events.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // Socket connection
  const eventIdStr = event?.id?.toString() || null;
  const {
    isConnected,
    participants,
    messages,
    authError,
    sendMessage,
    toggleMute,
    socket,
  } = useSocket({
    eventId: eventIdStr,
    enabled: !!event && isAuthenticated,
  });

  // Audio
  const [isMuted, setIsMuted] = useState(true);
  const { micEnabled, micError, enableMic, disableMic } = useWebRTCAudio({
    socket,
    isConnected,
    participants,
    isMuted,
  });

  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Countdown
  const countdown = useCountdown(event?.startTime || new Date());

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle send message
  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setChatInput("");
  };

  // Handle mic toggle
  const handleMicToggle = async () => {
    if (!micEnabled) {
      await enableMic();
      setIsMuted(false);
      toggleMute(false);
    } else if (isMuted) {
      setIsMuted(false);
      toggleMute(false);
    } else {
      setIsMuted(true);
      toggleMute(true);
    }
  };

  // Copy invite link
  const handleCopyLink = () => {
    const url = `${window.location.origin}/event/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Leave room
  const handleLeave = () => {
    disableMic();
    navigate(`/event/${slug}`);
  };

  // Memoize sorted participants
  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      if (a.isSpeaking && !b.isSpeaking) return -1;
      if (!a.isSpeaking && b.isSpeaking) return 1;
      if (!a.isMuted && b.isMuted) return -1;
      if (a.isMuted && !b.isMuted) return 1;
      return a.joinedAt - b.joinedAt;
    });
  }, [participants]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to join a watch party room.</p>
          <Link href="/login" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Party Not Found</h2>
          <Link href="/events" className="text-primary hover:underline">Browse Watch Parties</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <header className="flex-shrink-0 border-b border-border/30 bg-card/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back + Match Info */}
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={handleLeave} className="p-2 rounded-lg hover:bg-muted/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="min-w-0">
              <h1 className="font-display text-lg font-bold text-foreground truncate">
                {event.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {event.venue}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {countdown.days > 0
                    ? `${countdown.days}d ${countdown.hours}h to go`
                    : countdown.hours > 0
                    ? `${countdown.hours}h ${countdown.minutes}m to go`
                    : "LIVE NOW"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Connection status + actions */}
          <div className="flex items-center gap-2">
            {/* Connection indicator */}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
              isConnected ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
              {isConnected ? "Connected" : "Connecting..."}
            </div>

            {/* Participant count */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/20 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              {participants.length}
            </div>

            {/* Copy invite link */}
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg hover:bg-muted/30 transition-colors text-muted-foreground hover:text-foreground"
              title="Copy invite link"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Leave */}
            <button
              onClick={handleLeave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              Leave
            </button>
          </div>
        </div>
      </header>

      {/* Auth error */}
      {authError && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm text-center">
          {authError}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Audio Participants Grid */}
        <div className="hidden lg:flex flex-col w-80 border-r border-border/30 bg-card/40">
          <div className="px-4 py-3 border-b border-border/20">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              Audio Room
              <span className="text-xs text-muted-foreground font-normal ml-auto">
                {participants.filter(p => !p.isMuted).length} speaking
              </span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-3 gap-3">
              <AnimatePresence>
                {sortedParticipants.map((p) => (
                  <motion.div
                    key={p.socketId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold
                      ${p.isSpeaking
                        ? "bg-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : p.isMuted
                        ? "bg-muted/30"
                        : "bg-muted/50 ring-1 ring-border/50"
                      }`}
                    >
                      {p.userName.charAt(0).toUpperCase()}
                      {p.isMuted && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                          <MicOff className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {p.isSpeaking && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Volume2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground truncate max-w-full text-center">
                      {p.userId === user?.id ? "You" : p.userName.split(" ")[0]}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {participants.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                No one in the room yet. Be the first!
              </div>
            )}
          </div>

          {/* Mic error */}
          {micError && (
            <div className="px-4 py-2 text-xs text-red-400 bg-red-500/5 border-t border-red-500/10">
              <Shield className="w-3 h-3 inline mr-1" />
              {micError}
            </div>
          )}
        </div>

        {/* Center/Right: Chat */}
        <div className="flex-1 flex flex-col">
          {/* Mobile tabs */}
          <div className="lg:hidden flex border-b border-border/30">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === "chat" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Chat
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === "participants" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              }`}
            >
              <Users className="w-4 h-4" /> Fans ({participants.length})
            </button>
          </div>

          {/* Mobile: Participants view */}
          {activeTab === "participants" && (
            <div className="lg:hidden flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-4 gap-3">
                {sortedParticipants.map((p) => (
                  <div key={p.socketId} className="flex flex-col items-center gap-1.5">
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-base font-bold
                      ${p.isSpeaking
                        ? "bg-primary/20 ring-2 ring-primary"
                        : p.isMuted ? "bg-muted/30" : "bg-muted/50"
                      }`}
                    >
                      {p.userName.charAt(0).toUpperCase()}
                      {p.isMuted && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                          <MicOff className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground truncate max-w-full text-center">
                      {p.userId === user?.id ? "You" : p.userName.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat messages */}
          <div className={`flex-1 overflow-y-auto px-4 py-3 space-y-1 ${activeTab !== "chat" ? "hidden lg:block" : ""}`}>
            {/* Welcome message */}
            <div className="text-center py-4 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs">
                <MessageSquare className="w-3.5 h-3.5" />
                Welcome to the watch party room!
              </div>
            </div>

            {messages.map((msg) => {
              const isMe = msg.userId === user?.id;
              return (
                <div key={msg.id} className={`flex gap-2 ${isMe ? "justify-end" : ""}`}>
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-muted/40 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {msg.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={`max-w-[75%] ${isMe ? "text-right" : ""}`}>
                    {!isMe && (
                      <span className="text-xs text-muted-foreground font-medium">
                        {msg.userName}
                      </span>
                    )}
                    <div className={`inline-block px-3 py-1.5 rounded-2xl text-sm ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted/30 text-foreground rounded-bl-sm"
                    }`}>
                      {msg.text}
                    </div>
                    <div className="text-[10px] text-muted-foreground/50 mt-0.5">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input + Mic controls */}
          <div className={`flex-shrink-0 border-t border-border/30 bg-card/60 p-3 ${activeTab !== "chat" ? "hidden lg:block" : ""}`}>
            <div className="flex items-center gap-2">
              {/* Mic toggle */}
              <button
                onClick={handleMicToggle}
                className={`p-2.5 rounded-full transition-all ${
                  !micEnabled
                    ? "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                    : isMuted
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "bg-green-500/20 text-green-400 hover:bg-green-500/30 ring-2 ring-green-500/30"
                }`}
                title={!micEnabled ? "Enable microphone" : isMuted ? "Unmute" : "Mute"}
              >
                {!micEnabled || isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Chat input */}
              <div className="flex-1 flex items-center gap-2 bg-muted/20 rounded-full px-4 py-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                  maxLength={500}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  className="p-1.5 rounded-full bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mic status text */}
            <div className="text-center mt-1.5">
              <span className="text-[10px] text-muted-foreground/60">
                {!micEnabled
                  ? "Tap the mic to enable audio"
                  : isMuted
                  ? "Microphone muted — tap to unmute"
                  : "You are live — others can hear you"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Remote audio elements (hidden) */}
      {/* These play remote participants' audio streams */}
    </div>
  );
}
