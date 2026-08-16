import RedisClient from "ioredis"
import { config } from "./env.config"
import { logger } from "../logger"

export const redisClient = new RedisClient(config.redis.url, {
  maxRetriesPerRequest: 1,
  retryStrategy: (attempt) => Math.min(attempt * 200, 2000)
})

redisClient.on("error", (err) => {
  logger.error({ err }, "Redis client error")
})

redisClient.on("connect", () => {
  logger.info("Redis client connected")
})
