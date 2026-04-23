// CSRF protection strategy (no token required)
//
// This site's API endpoints are protected against CSRF by three layered defences:
//
// 1. **Origin header check** (`origin.ts`) — rejects requests whose Origin
//    header doesn't match the allow-list.
// 2. **Content-Type: application/json** — HTML forms can only send
//    application/x-www-form-urlencoded, multipart/form-data, or text/plain.
//    A cross-origin request with `application/json` triggers a CORS preflight
//    that the server doesn't grant, so the browser blocks it.
// 3. **reCAPTCHA v3** — verified server-side; a CSRF attacker on another
//    origin cannot obtain a valid token for our site key + action.
//
// A per-session CSRF token would add no meaningful security on top of these
// three checks and would require either server-side state or a signing secret,
// both of which add complexity without benefit for this architecture.
