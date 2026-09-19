import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const DB_KEY = 'mukrata_db';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const data = await redis.get(DB_KEY);
      return res.status(200).json(data || null);
    }
    if (req.method === 'POST') {
      await redis.set(DB_KEY, req.body);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
