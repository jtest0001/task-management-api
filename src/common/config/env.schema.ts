import { z } from "zod"

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  // Consumed by the Prisma CLI via prisma.config.ts, not by the running server — validated
  // here on purpose so a missing value fails at boot rather than midway through a migration.
  // Render's pre-deploy command (once on a paid plan) runs in this same environment, so the
  // server and the migration step share these variables.
  DIRECT_DB_URL: z.string().min(1),
  REDIS_URL: z.url({ protocol: /^rediss?$/ }),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  FRONT_END_URL: z.url({ protocol: /^https?$/ }).transform((u) => new URL(u).origin),
  REFRESH_TOKEN_COOKIE_NAME: z.string().min(1)
})
