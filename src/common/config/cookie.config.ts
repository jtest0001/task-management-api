import { CookieOptions } from "express"
import { config } from "./env.config"

const isProduction = config.server.nodeEnv === "production"

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000
}
