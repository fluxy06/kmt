# Production hardening checklist

## 1) Infrastructure security (critical)
- Put the app behind reverse proxy (Nginx/Traefik/Cloudflare) with TLS 1.2+ and automatic HTTPS redirect.
- Enable WAF rules (Cloudflare WAF / Nginx ModSecurity) to block common OWASP signatures.
- Restrict CORS to trusted origins only; deny wildcard `*` for admin routes.
- Store admin secrets only on backend side. Frontend tokens are considered potentially compromised.

## 2) DDoS protection
- Configure global rate limiting at edge/CDN level.
- Add stricter rate limits for sensitive endpoints:
  - `/kmt/admin/*`
  - `/kmt/services` write methods (`POST/PUT/DELETE`)
  - `/kmt/analytics/collect`
- Apply connection limits per IP and burst control.
- Add bot management/challenge for suspicious traffic and geo/IP reputation filtering.

## 3) Response/security headers
Configure on the reverse proxy:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- CSP in HTTP response headers (preferred over meta tag).

## 4) Data leakage prevention
- Never log admin tokens in frontend, backend, analytics or error trackers.
- Mask sensitive values in dashboards and browser UI.
- Disable source maps in production builds.
- Avoid putting secrets in URL path/query (they leak via logs and referrers).

## 5) Performance baseline
- Serve static assets from CDN with compression (Brotli + gzip fallback).
- Enable long cache for hashed static assets and `immutable` cache-control.
- Keep API responses for mutable data with short/no cache (`no-store` where needed).
- Monitor Core Web Vitals (LCP/INP/CLS) and backend p95 latency.


## 6) Ready-to-use configuration
- Added example Nginx profile with rate-limit, connection-limit and headers:
  - `deploy/nginx/security.conf.example`
- Recommended deployment stack for DDoS resilience:
  1. CDN/edge protection (Cloudflare/fastly) + bot challenge
  2. Reverse proxy limits (Nginx `limit_req`, `limit_conn`)
  3. Backend app limits (per-endpoint throttling and circuit breaker)
