import { json } from "@remix-run/node";
import { Ratelimit } from "@upstash/ratelimit";

import { checkRateLimit, getIP } from "~/services/redis.server";

export interface RateLimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

export async function applyRateLimit(
  request: Request,
  rateLimit: Ratelimit,
  identifier?: string,
): Promise<RateLimitResponse | Response> {
  const clientIdentifier = identifier || getIP(request);
  const result = await checkRateLimit(rateLimit, clientIdentifier);

  if (!result.success) {
    return json(
      {
        error: "Rate limit exceeded",
        message: `Too many requests. Try again at ${result.reset.toLocaleTimeString()}`,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset.toISOString(),
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

// Helper to add rate limit headers to successful responses
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
