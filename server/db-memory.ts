/**
 * IN-MEMORY DATABASE STORAGE
 * This is a temporary solution for demo/testing without external database
 * Data will reset when server restarts
 */

import bcrypt from 'bcryptjs';

// In-memory storage
const users: any[] = [];
const events: any[] = [];
const eventRegistrations: any[] = [];

let userIdCounter = 1;
let eventIdCounter = 1;
let registrationIdCounter = 1;

// User functions
export async function createUser(data: { name: string; email: string; password: string; favoriteTeam?: string }) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = {
    id: userIdCounter++,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: 'user' as const,
    createdAt: new Date(),
  };
  users.push(user);
  return user;
}

export async function getUserByEmail(email: string) {
  return users.find(u => u.email === email) || null;
}

export async function getUserById(id: number) {
  return users.find(u => u.id === id) || null;
}

// Event functions
export async function createEvent(data: any) {
  const event = {
    id: eventIdCounter++,
    ...data,
    seatsTaken: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  events.push(event);
  return event;
}

export async function getEvents() {
  return events;
}

export async function getEventById(id: number) {
  return events.find(e => e.id === id) || null;
}

export async function getEventBySlug(slug: string) {
  return events.find(e => e.slug === slug) || null;
}

export async function updateEvent(id: number, data: any) {
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  events[index] = {
    ...events[index],
    ...data,
    updatedAt: new Date(),
  };
  return events[index];
}

export async function deleteEvent(id: number) {
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return false;
  
  events.splice(index, 1);
  return true;
}

// Event registration functions
export async function createEventRegistration(data: { eventId: number; userId: number }) {
  const registration = {
    id: registrationIdCounter++,
    ...data,
    createdAt: new Date(),
  };
  eventRegistrations.push(registration);
  
  // Update seats taken
  const event = events.find(e => e.id === data.eventId);
  if (event) {
    event.seatsTaken++;
  }
  
  return registration;
}

export async function getEventRegistrations(eventId: number) {
  return eventRegistrations.filter(r => r.eventId === eventId);
}

export async function getUserRegistrations(userId: number) {
  return eventRegistrations.filter(r => r.userId === userId);
}

export async function isUserRegisteredForEvent(userId: number, eventId: number) {
  return eventRegistrations.some(r => r.userId === userId && r.eventId === eventId);
}

export async function deleteEventRegistration(userId: number, eventId: number) {
  const index = eventRegistrations.findIndex(r => r.userId === userId && r.eventId === eventId);
  if (index === -1) return false;
  
  eventRegistrations.splice(index, 1);
  
  // Update seats taken
  const event = events.find(e => e.id === eventId);
  if (event && event.seatsTaken > 0) {
    event.seatsTaken--;
  }
  
  return true;
}
