import jwt from "jsonwebtoken"
import { config } from "../config"
import { UnauthorizedError } from "../errors"

interface AccessTokenPayload {
  sub: string
}

interface RefreshTokenPayload extends AccessTokenPayload {
  sid: string
}

export const generateAccessToken = (userId: string) => {
  try {
    const accessToken = jwt.sign(
      {
        sub: userId
      },
      config.jwt.accessSecret,
      {
        expiresIn: "15m"
      }
    )
    return accessToken
  } catch {
    throw new UnauthorizedError()
  }
}

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwt.accessSecret) as AccessTokenPayload
  } catch {
    throw new UnauthorizedError()
  }
}

export const generateRefreshToken = (payload: RefreshTokenPayload) => {
  try {
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: "7d"
    })

    return refreshToken
  } catch {
    throw new UnauthorizedError()
  }
}

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload
  } catch {
    throw new UnauthorizedError()
  }
}
