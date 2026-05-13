import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached) as T;

  const data = await fn();
  await redis.setex(key, ttlSeconds, JSON.stringify(data));
  return data;
}

export async function rateLimitCheck(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, windowSeconds);
  return current <= maxRequests;
}
