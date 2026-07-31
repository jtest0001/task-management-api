import cookieParser from "cookie-parser"
import express from "express"
import { corsConfig } from "./common/config/cors.config"
import { config } from "./common/config/env.config"
import { globalErrorHandler } from "./common/middleware/error.middleware"
import { requestIdMiddleware } from "./common/middleware/request-id.middleware"
import { authRouter } from "./modules/auth/auth.module"
import { httpLoggerMiddleware } from "./common/middleware/http-logger.middleware"

export const createApp = () => {
  // Create app instance
  const app = express()

  // middlewares
  app.use(corsConfig)
  app.use(requestIdMiddleware)
  app.use(httpLoggerMiddleware)
  app.use(express.json())
  app.use(cookieParser())

  // Routes
  app.get("/health", (_req, res) => {
    res.json({ message: `Server is up and running on port ${config.server.port}` })
  })
  app.use("/auth", authRouter)

  // Global error middleware
  app.use(globalErrorHandler)

  return app
}
