import rateLimit from "express-rate-limit"
import RedisStore, { RedisReply } from "rate-limit-redis"
import { logger } from "../logger"
import { TooManyRequestsError } from "../errors"
import { redisClient } from "./redis.config"

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute).
  // The platform health check polls /health every ~30s forever. Counting it burns a large
  // share of the Upstash monthly command quota and protects nothing — the endpoint is an
  // unauthenticated liveness probe with no side effects, and throttling it would only make
  // the platform believe the service is down.
  skip: (req) => req.path === "/health",
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  passOnStoreError: true, // If Redis is unreachable, allow the request through instead of failing closed
  handler: (req, _res) => {
    logger.error(`Global rate limit exceeded for IP: ${req.ip}`)
    throw new TooManyRequestsError()
  },
  store: new RedisStore({
    prefix: "global",
    sendCommand: (command: string, ...args: string[]) => redisClient.call(command, ...args) as Promise<RedisReply>
  })
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  passOnStoreError: false, // If Redis is unreachable, do not allow the request through
  skipSuccessfulRequests: true,
  handler: (req, _res) => {
    logger.error(`Auth rate limit exceeded for IP: ${req.ip}`)
    throw new TooManyRequestsError()
  },
  store: new RedisStore({
    prefix: "auth",
    sendCommand: (command: string, ...args: string[]) => redisClient.call(command, ...args) as Promise<RedisReply>
  })
})

export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30, // Limit each IP to 30 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  passOnStoreError: false, // If Redis is unreachable, do not allow the request through
  skipSuccessfulRequests: true,
  handler: (req, _res) => {
    logger.error(`Refresh rate limit exceeded for IP: ${req.ip}`)
    throw new TooManyRequestsError()
  },
  store: new RedisStore({
    prefix: "refresh",
    sendCommand: (command: string, ...args: string[]) => redisClient.call(command, ...args) as Promise<RedisReply>
  })
})
