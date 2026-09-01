import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATH = "/pvc-admin-bbh5xn";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pvc2024secure";

// Simple in-memory rate limiting (per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per minute for general
const RATE_LIMIT_API_MAX = 20; // 20 requests per minute for API
const RATE_LIMIT_ADMIN_MAX = 10; // 10 requests per minute for admin

function checkRateLimit(ip: string, max: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= max) return false;

  entry.count++;
  return true;
}

// Clean up old entries periodically
function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) rateLimitMap.delete(ip);
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Cleanup every 100 requests (approximation)
  if (Math.random() < 0.01) cleanupRateLimit();

  // Block known attack paths
  const blockedPaths = [
    "/wp-admin",
    "/wp-login",
    "/xmlrpc.php",
    "/.env",
    "/.git",
    "/wp-content",
    "/wp-includes",
    "/phpmyadmin",
    "/admin.php",
    "/login",
    "/administrator",
    "/config.php",
    "/setup.php",
    "/debug",
    "/test",
    "/backup",
  ];

  for (const blocked of blockedPaths) {
    if (pathname.toLowerCase().startsWith(blocked)) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // Block suspicious query patterns (SQL injection attempts)
  const url = request.url;
  const suspiciousPatterns = [
    /union\s+select/i,
    /select\s+.*from/i,
    /insert\s+into/i,
    /drop\s+table/i,
    /--\s/,
    /\/etc\/passwd/i,
    /\/bin\/sh/i,
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // Admin panel protection
  if (pathname.startsWith(ADMIN_PATH)) {
    // Rate limit admin access
    if (!checkRateLimit(`admin:${ip}`, RATE_LIMIT_ADMIN_MAX)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check password cookie
    const authCookie = request.cookies.get("pvc_admin_auth");

    // If accessing admin login page (no password set) or API auth endpoint
    if (
      pathname === ADMIN_PATH ||
      pathname === `${ADMIN_PATH}/` ||
      pathname.startsWith(`${ADMIN_PATH}/api/auth`)
    ) {
      return NextResponse.next();
    }

    // Check password for all other admin routes
    if (!authCookie || authCookie.value !== ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL(ADMIN_PATH, request.url));
    }
  }

  // Rate limit API routes
  if (pathname.startsWith("/api/")) {
    if (!checkRateLimit(`api:${ip}`, RATE_LIMIT_API_MAX)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  // General rate limit
  if (!checkRateLimit(`general:${ip}`, RATE_LIMIT_MAX)) {
    return new NextResponse(null, { status: 429 });
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Hide server info
  response.headers.delete("X-Powered-By");
  response.headers.delete("Server");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png).*)",
  ],
};
