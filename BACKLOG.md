# Backlog

- [ ] Change password feature (authenticated user updates their own password)
- [ ] Project list pagination
- [ ] Project ownership transfer — no endpoint exists; `project-member.service.ts` explicitly
      blocks changing or removing the OWNER role, so a project's owner can never change today
- [ ] Set `app.set("trust proxy", ...)` in `app.ts` once deployed behind a reverse proxy/load
      balancer. Without it, `req.ip` (used as the rate-limit key in
      `express-rate-limiter.config.ts`) resolves to the proxy's IP for every request, so all
      users share one rate-limit bucket. Set it to the exact hop count of your infra (e.g. `1`
      for a single reverse proxy) — `true` trusts `X-Forwarded-For` unconditionally, which lets
      an attacker spoof a fresh IP per request and bypass the limiter entirely.
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
