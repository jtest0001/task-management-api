# Backlog

- [ ] Change password feature (authenticated user updates their own password)
- [ ] Project list pagination
- [ ] Project ownership transfer — no endpoint exists; `project-member.service.ts` explicitly
      blocks changing or removing the OWNER role, so a project's owner can never change today
- [ ] Hardening candidate (low severity, not urgent): login timing leak — `auth.service.ts`
      `login()` only runs `comparePasswords` when the user exists, so a nonexistent email returns
      faster than a wrong password for a real one, leaking account existence via response time.
      Already mitigated in practice by `authLimiter` (10 attempts/15min/IP), and only reveals
      "does this email have an account" — not credentials. Fix when convenient: compare against
      a fixed, valid dummy bcrypt hash when the user isn't found, so both paths cost the same.
- [ ] Session lifetime — `auth.service.ts` `refresh()` resets `expiresAt` to +7 days on every
      refresh (sliding expiry, no absolute cap), so an active session never forces re-login.
      Consider an absolute max lifetime set at login. Also no cleanup job for expired session
      rows — they only get deleted when someone tries to use them.
- [ ] No test suite. Would have caught the refresh-token-rotation bug (bcrypt truncation making
      reuse detection inert) on day one — a replay-a-consumed-token test asserting 401 is the
      natural first case to add once a test setup exists.
- [ ] Test candidate (not a bug): `token-hash.ts` `compareTokens`'s `a.length !== b.length` guard
      only exists to stop `timingSafeEqual` from throwing `RangeError` on malformed/legacy hash
      rows (e.g. old bcrypt values) — reviewed and confirmed it is not an attacker-facing gate,
      since `hashToken` (SHA-256) always outputs a fixed 32-byte digest regardless of input, so
      length can never be attacker-controlled. Worth a regression test once a test suite exists
      (garbage token vs. real token, malformed stored hash vs. well-formed) so this stays true.

## Deployment (Vercel FE + Render/Railway BE, Neon Postgres, Upstash Redis)

- [ ] VERIFY `app.set("trust proxy", 2)` on the PROXIED path. Confirmed working for DIRECT
      requests (Postman -> Render produced a `global<public-ip>` key in Upstash, not a private
      one). Not yet confirmed through Vercel, which is a different `x-forwarded-for` chain
      (two hops instead of one) and is the path real users take. Test once the client is live:
      `curl -s https://<app>.vercel.app/auth/me`, then check the new Upstash key carries your
      public IP. A private IP or the `::/56` form means every user shares one bucket.
      Note: `global10.x.x.x` keys are the platform health checker and are expected/harmless;
      `auth::/56` came from local dev, where there is no `x-forwarded-for` so `req.ip` is `::`.
- [ ] The API is effectively a PUBLIC API — accepted, revisit on the triggers below. The Render
      URL is reachable by anyone (and published in TLS Certificate Transparency logs regardless
      of what the repo contains), so a third party can point their own Vercel proxy at it and
      run a fully working clone against the SAME Neon database. Deliberately not treated as a
      defect: authorization is enforced per-request in the services (membership/role checks,
      queries scoped through `project.members.some({ userId })`), so an unauthenticated caller
      reaches nothing, and a registered one sees only their own data. CORS cannot help here at
      all — a server-side proxy is not a browser and simply does not participate in CORS.
      Real (non-breach) consequences:
        * Resource abuse — a third party burns OUR Neon storage / Upstash commands / Render
          compute. Most realistic harm; on free tiers it caps out rather than billing.
        * Mass registration — `/auth/register` is public and `authLimiter` is keyed on `req.ip`,
          which is spoofable via `x-forwarded-for` on the direct path (see below), so the
          throttle is evadable and the user table can be bloated.
        * Clone phishing — a proxied clone actually works, making a credential-harvesting page
          more convincing. Only affects users lured to the attacker's domain; their proxy sees
          passwords, tokens and refresh cookies in transit. Users on our own domain unaffected.
      Sub-item — rate-limiter bypass via spoofed `x-forwarded-for`: `trust proxy 2` is required
      for the Vercel path, but on a DIRECT request it trusts more forwarded entries than exist,
      so a caller can pick a fresh bucket per request.
      No clean mitigation at the current tier. The real fix is a shared secret the proxy injects
      and the API requires, which `vercel.json` rewrites cannot do (they add no request headers)
      — it needs Vercel Middleware doing the proxying. Alternatives: IP allowlist (not on Render
      free), or Cloudflare in front.
      REVISIT WHEN: real users with data they'd miss; moving off free tier (abuse becomes money —
      the biggest single change); attaching a custom domain or promoting it publicly; or storing
      any PII, uploads, or payment details.
      CHEAPEST INTERIM CONTROL: usage alerts on Upstash and Neon. Abuse shows up as a quota curve
      well before anything else surfaces it.
- [ ] `/logout` and `/logout-all` have no rate limiter, unlike `/refresh`. Harmless under
      `SameSite=Lax`; only matters if the cookie ever moves to `SameSite=None`.
- [ ] `redis.config.ts` `retryStrategy` never gives up — it always returns a delay (capped at
      2s), so an unreachable Redis reconnects forever. Each attempt costs handshake commands
      against the Upstash monthly quota, so a misconfigured URL burns quota silently rather
      than failing loudly. Consider returning `null` after N attempts to stop retrying.
- [ ] Render free tier has no shell and no `preDeployCommand`, so migrations must be run from a
      local machine: `npx prisma migrate deploy` (picks up `DIRECT_DB_URL` via `prisma.config.ts`).
      There is no guardrail between a laptop and the production Neon branch — be deliberate.

## Security model: CSRF / CORS / SameSite (reference — decided, not a task)

Context: the client is on Vercel and the API on Render, which are different registrable domains
(`vercel.app` and `onrender.com` are both on the Public Suffix List), so browser requests between
them are cross-site. The chosen fix is a **Vercel rewrite proxy** preserving the path
(`/auth/* -> https://api.../auth/*`, NOT `/api/auth/*` — the refresh cookie is scoped `Path=/auth`
and a prefixed path would silently never match it; same trap already documented in
`client-app/vite.config.ts`). Same-origin means `sameSite: "lax"` keeps working in production.

Why NOT `sameSite: "none"` (the alternative that was rejected):

- `None` would work, and the exposure would have been limited — but it ships an API with zero CSRF
  defense, where the only thing keeping it non-serious is that the cookie-authenticated endpoints
  happen to be body-less and low-value today. The next such endpoint becomes a real hole silently.

CSRF requires ALL THREE to hold. Everything here follows from that:

1. The credential is attached AUTOMATICALLY by the browser (cookie / Basic / client cert).
   Bearer tokens are NOT — JS on our origin must set the header, and a foreign origin cannot read
   our token (it lives in module memory, `client-app/src/lib/api/token-store.ts`). So every
   `/projects`, `/tasks`, `/comments`, `/labels` route is structurally CSRF-immune.
2. The endpoint has a SIDE EFFECT. Read-only endpoints are not CSRF targets — the attacker cannot
   read the response anyway.
3. The attacker can CONSTRUCT the request cross-site: no preflight triggered, nothing unguessable
   required. A CSRF token is simply an explicit way to violate this condition.

Under `SameSite=None`, only these hit all three (cookie-only, no body, so no preflight):
`POST /auth/refresh`, `POST /auth/logout`, `POST /auth/logout-all` — impact is forced logout /
session churn, NOT token theft. `/login` and `/register` are protected by needing an
`application/json` body, which is not CORS-safelisted and therefore preflights.

Things that are easy to get wrong, verified by experiment:

- **CORS never blocks a request at the server.** With `origin: <string>` the `cors` package does
  not compare anything — it unconditionally emits `Access-Control-Allow-Origin: <that string>`.
  The handler runs and returns 200 for an `evil.com` origin; the BROWSER compares the header to
  its own origin and withholds the response body. So CORS protects response bodies, not the API.
  `curl`/Postman ignore it entirely.
- **Therefore CSRF is blind:** an attacker can cause a token to be minted but never sees it — the
  response goes to the victim's browser. Every read path (fetch, `no-cors`, iframe, `<script>`)
  is closed by the Same-Origin Policy.
- **Preflight is not about having a body.** A request skips preflight only if method is
  GET/HEAD/POST AND `Content-Type` is urlencoded/multipart/text-plain AND no non-safelisted
  headers. `GET /auth/me` with an `Authorization` header has no body and still preflights; an
  attacker's urlencoded `<form>` POST has a body and does not.
- **Endpoint obscurity is not protection.** The Vercel-served JS bundle names every route.

What would BREAK this model (watch for these):

- Adding a cookie-authenticated, body-less, state-changing endpoint — joins the vulnerable set
  with no warning from the code.
- Loosening CORS to reflect origins (`origin: true`, or a `/vercel\.app$/` regex to support
  preview deploys). That is the change that upgrades this from nuisance to real token theft.
  The proxy makes preview deploys work WITHOUT touching CORS — prefer that.
- Moving the access token to `localStorage` or a JS-readable cookie — kills the Bearer immunity.
- Any XSS on our origin — bypasses all of the above; attacker code runs as our page.

## Nice to have (future feature ideas, not required for core functionality)

- [ ] Task search/filtering across projects (currently `GET /projects/:projectId/tasks` scopes
      to one project only — no cross-project view of "my tasks")
- [ ] Activity feed / audit log per project or task (who changed what, when)
- [ ] Notifications (assigned to a task, mentioned in a comment, due date approaching)
- [ ] Due date reminders / overdue task surfacing
- [ ] Task comments: edit history or @mentions
- [ ] Bulk task operations (bulk status update, bulk label assignment)
- [ ] File/attachment support on tasks or comments
- [ ] Project templates (clone an existing project's structure into a new one)
- [ ] Webhooks or an events system for external integrations
- [ ] Full-text search across tasks/comments (would need Postgres `tsvector` or an external
      index — current `search` query param on tasks is likely a simple `LIKE`/`contains`)
