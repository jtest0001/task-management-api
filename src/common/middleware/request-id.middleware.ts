import { RequestHandler } from "express"
import { randomUUID } from "node:crypto"
import { logger } from "../logger"

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const requestId = req.get("X-Request-ID") || randomUUID()
  req.requestId = requestId
  res.setHeader("X-Request-ID", requestId)

  req.logger = logger.child({
    requestId,
    method: req.method,
    path: req.path
  })

  next()
}
