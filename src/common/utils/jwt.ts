import jwt from "jsonwebtoken"
import { config } from "../config"

interface AccessTokenPayload {
  sub: string
}

interface RefreshTokenPayload extends AccessTokenPayload {
  sid: string
}

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    {
      sub: userId
    },
    config.jwt.accessSecret,
    {
      expiresIn: "15m"
    }
  )
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.jwt.accessSecret) as AccessTokenPayload
}
