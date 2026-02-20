import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { appRouter } from '../../server/routers';
import { createContext } from '../../server/_core/context';

const handler = createHTTPHandler({
  router: appRouter,
  createContext,
});

export default async function (req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Convert Vercel request/response to Node.js format
  await handler(req as any, res as any);
}
