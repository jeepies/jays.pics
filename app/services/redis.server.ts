import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = new Redis({
  url: process.env.REDIS_ENDPOINT,
  token: process.env.UPSTASH_TOKEN,
});

export const emailVerificationRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit:email-verification",
});

export const loginRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ratelimit:login",
});

export const registrationRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(2, "1 h"),
  analytics: true,
  prefix: "ratelimit:registration",
});

export const uploadRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, "1 h"),
  analytics: true,
  prefix: "ratelimit:upload",
});

export const apiRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "ratelimit:api",
});

export async function checkRateLimit(
  rateLimit: Ratelimit,
  identifier: string
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}> {
  const result = await rateLimit.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: new Date(result.reset),
  };
}

export function getIP(request: Request, fallback?: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const real = request.headers.get("x-real-ip");
  if (real) return real;

  return fallback || "anonymous";
}
