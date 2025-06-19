export function getIP(request: Request, fallback?: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const real = request.headers.get("x-real-ip");
  if (real) return real;

  if (fallback) {
    return fallback;
  }

  throw new Error("IP not found");
}
