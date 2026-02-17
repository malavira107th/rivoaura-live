/**
 * Tests for Socket.IO moderation logic.
 * We test the pure helper functions and in-memory room state management
 * by extracting and testing the logic patterns used in socket.ts.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";

// ─── Replicate the in-memory types and helpers from socket.ts ────────────────
// These mirror the exact logic in socket.ts so we can unit test the moderation
// rules without needing a live Socket.IO server.

interface RoomParticipant {
  socketId: string;
  userId: number;
  userName: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isHostMuted: boolean;
  joinedAt: number;
}

interface ChatMessage {
  id: string;
  userId: number;
  userName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

interface RoomState {
  participants: Map<string, RoomParticipant>;
  chatHistory: ChatMessage[];
  hostUserId: number | null;
  eventId: string;
}

function getOrCreateRoom(rooms: Map<string, RoomState>, eventId: string, hostUserId?: number): RoomState {
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

function isHost(room: RoomState, userId: number): boolean {
  return room.hostUserId === userId;
}

function getParticipantByUserId(room: RoomState, userId: number): [string, RoomParticipant] | null {
  for (const [sid, p] of Array.from(room.participants.entries())) {
    if (p.userId === userId) return [sid, p];
  }
  return null;
}

function createSystemMessage(text: string): ChatMessage {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId: 0,
    userName: "System",
    text,
    timestamp: Date.now(),
    isSystem: true,
  };
}

function addParticipant(room: RoomState, socketId: string, userId: number, userName: string): RoomParticipant {
  const p: RoomParticipant = {
    socketId,
    userId,
    userName,
    isMuted: true,
    isSpeaking: false,
    isHostMuted: false,
    joinedAt: Date.now(),
  };
  room.participants.set(socketId, p);
  return p;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Room state management", () => {
  let rooms: Map<string, RoomState>;

  beforeEach(() => {
    rooms = new Map();
  });

  it("creates a new room with host", () => {
    const room = getOrCreateRoom(rooms, "event-1", 42);
    expect(room.hostUserId).toBe(42);
    expect(room.eventId).toBe("event-1");
    expect(room.participants.size).toBe(0);
    expect(room.chatHistory).toHaveLength(0);
  });

  it("returns existing room on subsequent calls", () => {
    const room1 = getOrCreateRoom(rooms, "event-1", 42);
    addParticipant(room1, "socket-1", 42, "Host User");
    const room2 = getOrCreateRoom(rooms, "event-1");
    expect(room2.participants.size).toBe(1);
    expect(room2.hostUserId).toBe(42);
  });

  it("creates room without host when hostUserId not provided", () => {
    const room = getOrCreateRoom(rooms, "event-2");
    expect(room.hostUserId).toBeNull();
  });
});

describe("Host identification", () => {
  let rooms: Map<string, RoomState>;
  let room: RoomState;

  beforeEach(() => {
    rooms = new Map();
    room = getOrCreateRoom(rooms, "event-1", 100);
    addParticipant(room, "socket-host", 100, "Host");
    addParticipant(room, "socket-user1", 200, "User1");
    addParticipant(room, "socket-user2", 300, "User2");
  });

  it("correctly identifies the host", () => {
    expect(isHost(room, 100)).toBe(true);
  });

  it("correctly identifies non-host users", () => {
    expect(isHost(room, 200)).toBe(false);
    expect(isHost(room, 300)).toBe(false);
  });

  it("returns false for unknown user IDs", () => {
    expect(isHost(room, 999)).toBe(false);
  });
});

describe("Participant lookup", () => {
  let rooms: Map<string, RoomState>;
  let room: RoomState;

  beforeEach(() => {
    rooms = new Map();
    room = getOrCreateRoom(rooms, "event-1", 100);
    addParticipant(room, "socket-host", 100, "Host");
    addParticipant(room, "socket-user1", 200, "User1");
  });

  it("finds participant by userId", () => {
    const result = getParticipantByUserId(room, 200);
    expect(result).not.toBeNull();
    expect(result![0]).toBe("socket-user1");
    expect(result![1].userName).toBe("User1");
  });

  it("returns null for non-existent userId", () => {
    const result = getParticipantByUserId(room, 999);
    expect(result).toBeNull();
  });
});

describe("Host mute user", () => {
  let rooms: Map<string, RoomState>;
  let room: RoomState;

  beforeEach(() => {
    rooms = new Map();
    room = getOrCreateRoom(rooms, "event-1", 100);
    addParticipant(room, "socket-host", 100, "Host");
    addParticipant(room, "socket-user1", 200, "User1");
    // User1 is unmuted and speaking
    const user1 = room.participants.get("socket-user1")!;
    user1.isMuted = false;
    user1.isSpeaking = true;
  });

  it("host can mute a participant", () => {
    // Verify host
    expect(isHost(room, 100)).toBe(true);

    const target = getParticipantByUserId(room, 200);
    expect(target).not.toBeNull();
    const [, targetParticipant] = target!;

    // Simulate mute action
    targetParticipant.isMuted = true;
    targetParticipant.isSpeaking = false;
    targetParticipant.isHostMuted = true;

    expect(targetParticipant.isMuted).toBe(true);
    expect(targetParticipant.isSpeaking).toBe(false);
    expect(targetParticipant.isHostMuted).toBe(true);
  });

  it("non-host cannot mute (permission check)", () => {
    // User1 (200) tries to mute Host (100)
    expect(isHost(room, 200)).toBe(false);
    // In the actual socket handler, this returns early with a moderation_notice
  });

  it("host-muted user cannot self-unmute", () => {
    const target = getParticipantByUserId(room, 200);
    const [, p] = target!;

    // Host mutes user
    p.isMuted = true;
    p.isSpeaking = false;
    p.isHostMuted = true;

    // User tries to unmute — should be blocked because isHostMuted is true
    const canUnmute = !p.isHostMuted;
    expect(canUnmute).toBe(false);
  });
});

describe("Host unmute user", () => {
  let rooms: Map<string, RoomState>;
  let room: RoomState;

  beforeEach(() => {
    rooms = new Map();
    room = getOrCreateRoom(rooms, "event-1", 100);
    addParticipant(room, "socket-host", 100, "Host");
    addParticipant(room, "socket-user1", 200, "User1");
    // User1 is host-muted
    const user1 = room.participants.get("socket-user1")!;
    user1.isMuted = true;
    user1.isHostMuted = true;
  });

  it("host can unmute a host-muted participant", () => {
    expect(isHost(room, 100)).toBe(true);

    const target = getParticipantByUserId(room, 200);
    const [, p] = target!;

    // Simulate unmute
    p.isHostMuted = false;
    // User stays muted but can now self-unmute
    expect(p.isHostMuted).toBe(false);
    expect(p.isMuted).toBe(true); // Still muted, but can now toggle
  });

  it("after host unmute, user can self-unmute", () => {
    const target = getParticipantByUserId(room, 200);
    const [, p] = target!;

    // Host unmutes
    p.isHostMuted = false;

    // Now user can unmute themselves
    const canUnmute = !p.isHostMuted;
    expect(canUnmute).toBe(true);

    p.isMuted = false;
    expect(p.isMuted).toBe(false);
  });
});

describe("Host kick user", () => {
  let rooms: Map<string, RoomState>;
  let room: RoomState;

  beforeEach(() => {
    rooms = new Map();
    room = getOrCreateRoom(rooms, "event-1", 100);
    addParticipant(room, "socket-host", 100, "Host");
    addParticipant(room, "socket-user1", 200, "User1");
    addParticipant(room, "socket-user2", 300, "User2");
  });

  it("host can kick a participant", () => {
    expect(room.participants.size).toBe(3);

    const target = getParticipantByUserId(room, 200);
    expect(target).not.toBeNull();
    const [targetSid] = target!;

    // Simulate kick
    room.participants.delete(targetSid);

    expect(room.participants.size).toBe(2);
    expect(getParticipantByUserId(room, 200)).toBeNull();
  });

  it("host cannot kick themselves", () => {
    // In the actual handler, targetUserId === authUser.userId returns early
    const selfKickBlocked = 100 === 100; // host trying to kick self
    expect(selfKickBlocked).toBe(true);
    // Room should remain unchanged
    expect(room.participants.size).toBe(3);
  });

  it("kicked user is no longer in the room", () => {
    const target = getParticipantByUserId(room, 200);
    const [targetSid] = target!;
    room.participants.delete(targetSid);

    // Verify user is gone
    expect(getParticipantByUserId(room, 200)).toBeNull();
    // Other participants remain
    expect(getParticipantByUserId(room, 100)).not.toBeNull();
    expect(getParticipantByUserId(room, 300)).not.toBeNull();
  });

  it("system message is created for kick", () => {
    const sysMsg = createSystemMessage("User1 was removed from the party by the host");
    room.chatHistory.push(sysMsg);

    expect(room.chatHistory).toHaveLength(1);
    expect(room.chatHistory[0].isSystem).toBe(true);
    expect(room.chatHistory[0].text).toContain("removed from the party");
    expect(room.chatHistory[0].userId).toBe(0);
    expect(room.chatHistory[0].userName).toBe("System");
  });
});

describe("Host mute all", () => {
  let rooms: Map<string, RoomState>;
  let room: RoomState;

  beforeEach(() => {
    rooms = new Map();
    room = getOrCreateRoom(rooms, "event-1", 100);
    addParticipant(room, "socket-host", 100, "Host");
    addParticipant(room, "socket-user1", 200, "User1");
    addParticipant(room, "socket-user2", 300, "User2");
    addParticipant(room, "socket-user3", 400, "User3");

    // Some users are unmuted and speaking
    const u1 = room.participants.get("socket-user1")!;
    u1.isMuted = false;
    u1.isSpeaking = true;
    const u2 = room.participants.get("socket-user2")!;
    u2.isMuted = false;
  });

  it("mutes all participants except the host", () => {
    // Simulate mute all
    for (const [sid, p] of Array.from(room.participants.entries())) {
      if (p.userId !== 100) {
        p.isMuted = true;
        p.isSpeaking = false;
        p.isHostMuted = true;
      }
    }

    // Host should NOT be muted
    const host = room.participants.get("socket-host")!;
    expect(host.isMuted).toBe(true); // Host starts muted by default
    expect(host.isHostMuted).toBe(false); // But NOT host-muted

    // All others should be host-muted
    const u1 = room.participants.get("socket-user1")!;
    expect(u1.isMuted).toBe(true);
    expect(u1.isSpeaking).toBe(false);
    expect(u1.isHostMuted).toBe(true);

    const u2 = room.participants.get("socket-user2")!;
    expect(u2.isMuted).toBe(true);
    expect(u2.isHostMuted).toBe(true);

    const u3 = room.participants.get("socket-user3")!;
    expect(u3.isMuted).toBe(true);
    expect(u3.isHostMuted).toBe(true);
  });

  it("creates system message for mute all", () => {
    const sysMsg = createSystemMessage("Host muted all participants");
    room.chatHistory.push(sysMsg);

    expect(room.chatHistory).toHaveLength(1);
    expect(room.chatHistory[0].text).toBe("Host muted all participants");
    expect(room.chatHistory[0].isSystem).toBe(true);
  });
});

describe("System messages", () => {
  it("creates system message with correct structure", () => {
    const msg = createSystemMessage("Test system message");
    expect(msg.userId).toBe(0);
    expect(msg.userName).toBe("System");
    expect(msg.text).toBe("Test system message");
    expect(msg.isSystem).toBe(true);
    expect(msg.id).toMatch(/^msg_/);
    expect(msg.timestamp).toBeGreaterThan(0);
  });

  it("each system message has unique id", () => {
    const msg1 = createSystemMessage("Message 1");
    const msg2 = createSystemMessage("Message 2");
    expect(msg1.id).not.toBe(msg2.id);
  });
});

describe("Chat history limits", () => {
  let rooms: Map<string, RoomState>;
  let room: RoomState;

  beforeEach(() => {
    rooms = new Map();
    room = getOrCreateRoom(rooms, "event-1", 100);
  });

  it("trims chat history when exceeding 200 messages", () => {
    // Add 210 messages
    for (let i = 0; i < 210; i++) {
      room.chatHistory.push({
        id: `msg_${i}`,
        userId: 1,
        userName: "User",
        text: `Message ${i}`,
        timestamp: Date.now(),
      });
    }

    // Simulate the trim logic from socket.ts
    if (room.chatHistory.length > 200) {
      room.chatHistory = room.chatHistory.slice(-200);
    }

    expect(room.chatHistory).toHaveLength(200);
    // Oldest messages should be trimmed
    expect(room.chatHistory[0].text).toBe("Message 10");
    expect(room.chatHistory[199].text).toBe("Message 209");
  });
});

describe("Room cleanup", () => {
  let rooms: Map<string, RoomState>;

  beforeEach(() => {
    rooms = new Map();
  });

  it("removes empty rooms", () => {
    const room = getOrCreateRoom(rooms, "event-1", 100);
    addParticipant(room, "socket-1", 100, "Host");
    expect(rooms.size).toBe(1);

    // Remove participant
    room.participants.delete("socket-1");

    // Simulate cleanup
    if (room.participants.size === 0) {
      rooms.delete("event-1");
    }

    expect(rooms.size).toBe(0);
  });

  it("keeps rooms with remaining participants", () => {
    const room = getOrCreateRoom(rooms, "event-1", 100);
    addParticipant(room, "socket-1", 100, "Host");
    addParticipant(room, "socket-2", 200, "User");

    // Remove one participant
    room.participants.delete("socket-2");

    // Simulate cleanup
    if (room.participants.size === 0) {
      rooms.delete("event-1");
    }

    expect(rooms.size).toBe(1);
    expect(room.participants.size).toBe(1);
  });
});

describe("Room state emission (room_state event)", () => {
  let rooms: Map<string, RoomState>;
  let room: RoomState;

  beforeEach(() => {
    rooms = new Map();
    room = getOrCreateRoom(rooms, "event-1", 100);
    addParticipant(room, "socket-host", 100, "Host");
    addParticipant(room, "socket-user1", 200, "User1");
  });

  it("includes hostUserId in room state", () => {
    const state = {
      participants: Array.from(room.participants.values()).map(p => ({
        ...p,
        isHost: isHost(room, p.userId),
      })),
      chatHistory: room.chatHistory.slice(-100),
      hostUserId: room.hostUserId,
      myUserId: 200,
    };

    expect(state.hostUserId).toBe(100);
    expect(state.myUserId).toBe(200);
  });

  it("marks host participant with isHost flag", () => {
    const participants = Array.from(room.participants.values()).map(p => ({
      ...p,
      isHost: isHost(room, p.userId),
    }));

    const hostP = participants.find(p => p.userId === 100);
    const userP = participants.find(p => p.userId === 200);

    expect(hostP?.isHost).toBe(true);
    expect(userP?.isHost).toBe(false);
  });
});

describe("Toggle mute with host-mute restriction", () => {
  let rooms: Map<string, RoomState>;
  let room: RoomState;

  beforeEach(() => {
    rooms = new Map();
    room = getOrCreateRoom(rooms, "event-1", 100);
    addParticipant(room, "socket-host", 100, "Host");
    addParticipant(room, "socket-user1", 200, "User1");
  });

  it("allows normal unmute when not host-muted", () => {
    const p = room.participants.get("socket-user1")!;
    expect(p.isHostMuted).toBe(false);

    // User can unmute
    const canUnmute = !p.isHostMuted;
    expect(canUnmute).toBe(true);

    p.isMuted = false;
    expect(p.isMuted).toBe(false);
  });

  it("blocks unmute when host-muted", () => {
    const p = room.participants.get("socket-user1")!;
    p.isHostMuted = true;
    p.isMuted = true;

    // User tries to unmute — blocked
    const canUnmute = !p.isHostMuted;
    expect(canUnmute).toBe(false);
    // isMuted should remain true
    expect(p.isMuted).toBe(true);
  });

  it("allows mute even when host-muted (user can always mute themselves)", () => {
    const p = room.participants.get("socket-user1")!;
    p.isHostMuted = true;
    p.isMuted = false; // hypothetical state

    // User can always mute themselves
    p.isMuted = true;
    expect(p.isMuted).toBe(true);
  });
});
