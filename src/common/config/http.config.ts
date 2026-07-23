import { CookieOptions } from "express"
import { config } from "./env.config"

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.server.nodeEnv === "production",
  sameSite: "lax", // if client and server is cross origin, use 'none'
  path: "/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000
}
