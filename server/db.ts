/**
 * DATABASE LAYER - Using in-memory storage (no external DB required)
 * This provides the same interface as the original Drizzle ORM implementation
 * but stores data in memory for demo/testing purposes
 */

import * as memoryDb from './db-memory';

// Re-export all functions from memory DB
export const {
  createUser,
  getUserByEmail,
  getUserById,
  createEvent,
  getEvents,
  getEventById,
  getEventBySlug,
  updateEvent,
  deleteEvent,
  createEventRegistration,
  getEventRegistrations,
  getUserRegistrations,
  isUserRegisteredForEvent,
  deleteEventRegistration,
} = memoryDb;

// Additional helper functions to match original interface
export async function getUserByOpenId(openId: string) {
  // Not used in our implementation
  return null;
}

export async function createContactMessage(data: { name: string; email: string; message: string }) {
  // Store contact messages in memory (could be extended)
  console.log('[Contact Message]', data);
  return { id: Date.now(), ...data, createdAt: new Date() };
}

// Aliases for compatibility
export const getAllEvents = getEvents;
export const registerForEvent = createEventRegistration;
export const cancelRegistration = deleteEventRegistration;

export async function getRegistrationCount(eventId: number) {
  const registrations = await getEventRegistrations(eventId);
  return registrations.length;
}

export async function getUserRegistration(userId: number, eventId: number) {
  const isRegistered = await isUserRegisteredForEvent(userId, eventId);
  return isRegistered ? { userId, eventId } : null;
}

export async function getWaitlistCount(eventId: number) {
  // Waitlist not implemented in memory version
  return 0;
}

export async function getUserWaitlistEntry(userId: number, eventId: number) {
  // Waitlist not implemented in memory version
  return null;
}

export async function joinWaitlist(data: { userId: number; eventId: number }) {
  // Waitlist not implemented in memory version
  return { id: Date.now(), ...data, createdAt: new Date() };
}

export async function updateUserLastSignedIn(userId: number) {
  // Not critical for in-memory version
  return true;
}

export async function updateUserProfile(userId: number, data: { name?: string }) {
  // Not implemented in memory version
  return getUserById(userId);
}
