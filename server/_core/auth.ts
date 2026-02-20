import { SignJWT, jwtVerify } from "jose";
import { nanoid } from "nanoid";

// Custom JWT secret (will be set via Vercel environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";
const secret = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Create JWT token for authenticated user
 */
export async function createToken(userId: string, email: string): Promise<string> {
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // 30 days
    .setJti(nanoid())
    .sign(secret);

  return token;
}

/**
 * Verify and decode JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.userId || !payload.email) {
      return null;
    }
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch (error) {
    console.error("[Auth] Token verification failed:", error);
    return null;
  }
}

/**
 * Extract token from Authorization header or cookie
 */
export function extractToken(authHeader?: string, cookieToken?: string): string | null {
  // Try Authorization header first
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  
  // Fall back to cookie
  return cookieToken || null;
}
