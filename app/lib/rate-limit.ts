import { json } from "@remix-run/node";
import { Ratelimit } from "@upstash/ratelimit";

import { checkRateLimit, getIP } from "~/services/redis.server";

export interface RateLimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public rateLimitInfo: {
      limit: number;
      remaining: number;
      reset: Date;
    },
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

export async function applyRateLimit(
  request: Request,
  rateLimit: Ratelimit,
  identifier?: string,
): Promise<RateLimitResponse | Response> {
  const clientIdentifier = identifier || getIP(request);
  const result = await checkRateLimit(rateLimit, clientIdentifier);

  if (!result.success) {
    const resetTime = result.reset.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    return json(
      {
        error: "Rate limit exceeded",
        message: `Too many requests. You can try again at ${resetTime}`,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset.toISOString(),
        retryAfter: Math.ceil((result.reset.getTime() - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(
            (result.reset.getTime() - Date.now()) / 1000,
          ).toString(),
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.reset.toISOString(),
        },
      },
    );
  }

  return result;
}

export function isRateLimitResponse(response: any): response is Response {
  return response instanceof Response;
}

export function addRateLimitHeaders(
  response: Response,
  rateLimitResult: RateLimitResponse,
): Response {
  response.headers.set("X-RateLimit-Limit", rateLimitResult.limit.toString());
  response.headers.set(
    "X-RateLimit-Remaining",
    rateLimitResult.remaining.toString(),
  );
  response.headers.set(
    "X-RateLimit-Reset",
    rateLimitResult.reset.toISOString(),
  );

  return response;
}

/**
 * Helper function to create a standardized rate limit error for form errors
 */
export function createRateLimitFormError(rateLimitInfo: {
  limit: number;
  remaining: number;
  reset: Date;
}): string {
  const resetTime = rateLimitInfo.reset.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `Too many attempts. Please try again at ${resetTime}`;
}
