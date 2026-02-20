import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { parse as parseCookie } from "cookie";
import { verifyToken } from "./auth";
import { getUserById } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Extract token from cookie
    const cookies = opts.req.headers.cookie ? parseCookie(opts.req.headers.cookie) : {};
    const authToken = cookies.auth_token;

    if (authToken) {
      const payload = await verifyToken(authToken);
      if (payload) {
        const dbUser = await getUserById(parseInt(payload.userId));
        user = dbUser || null;
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
