import { RequestHandler } from "express"
import { UnauthorizedError } from "../errors"
import { verifyAccessToken } from "../utils/jwt"
import { JsonWebTokenError } from "jsonwebtoken"

export const authenticate: RequestHandler = (req, _res, next) => {
  const authorization = req.headers.authorization

  if (!authorization) throw new UnauthorizedError()

  const [scheme, token] = authorization.split(" ")
  if (scheme !== "Bearer" || !token) throw new UnauthorizedError()

  try {
    const payload = verifyAccessToken(token)
    req.user = {
      id: payload.sub
    }

    return next()
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError()
    }

    throw error
  }
}
