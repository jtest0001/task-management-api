import pino from "pino"
import { config } from "../config/env.config"

export const logger = pino({
  level: config.server.nodeEnv === "production" ? "info" : "debug",
  transport:
    config.server.nodeEnv === "production"
      ? undefined
      : {
          target: "pino-pretty",
          options: {
            colorize: true
          }
        }
})
