import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.REDIS_ENDPOINT,
  token: process.env.UPSTASH_TOKEN,
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

export const emailVerificationRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  prefix: "ratelimit:email-verification",
});

/**
 * Rate limit for login attempts.
 * Allows 20 login attempts per 15 minutes per identifier.
 * Used to prevent brute-force attacks on login endpoints.
 */
export const loginRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, "15 m"),
  prefix: "ratelimit:login",
});

/**
 * Rate limit for user registration.
 * Allows 10 registration attempts per hour per identifier.
 * Helps prevent abuse of the registration endpoint.
 */
export const registrationRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  prefix: "ratelimit:registration",
});

/**
 * Rate limit for file uploads.
 * Allows 100 uploads per hour per identifier.
 * Used to control excessive upload activity.
 */
export const uploadRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"),
  prefix: "ratelimit:upload",
});

/**
 * General API rate limit.
 * Allows 200 API requests per minute per identifier.
 * Used to prevent API abuse and DoS attacks.
 */
export const apiRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(200, "1 m"),
  prefix: "ratelimit:api",
});

/**
 * Rate limit for verification code requests.
 * Allows 15 verification code requests per hour per identifier.
 * Used to prevent abuse of verification code endpoints.
 */
export const verificationCodeRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(15, "1 h"),
  prefix: "ratelimit:verification-code",
});
