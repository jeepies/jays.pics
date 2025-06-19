import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.REDIS_ENDPOINT,
  token: process.env.UPSTASH_TOKEN,
});

// Rate limit for email verification requests (resend verification)
export const emailVerificationRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 requests per hour
  prefix: "ratelimit:email-verification",
});

// Rate limit for login attempts (per IP)
export const loginRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"), // 10 attempts per 15 minutes
  prefix: "ratelimit:login",
});

// Rate limit for registration attempts (per IP)
export const registrationRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 registrations per hour per IP
  prefix: "ratelimit:registration",
});

// Rate limit for file uploads
export const uploadRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, "1 h"), // 50 uploads per hour
  prefix: "ratelimit:upload",
});

// Rate limit for API calls
export const apiRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
  prefix: "ratelimit:api",
});

// Rate limit for email verification code attempts (per user)
export const verificationCodeRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"), // 10 verification attempts per hour per user
  prefix: "ratelimit:verification-code",
});

export async function checkRateLimit(
  rateLimit: Ratelimit,
  identifier: string,
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
