import express from "express"
import { config } from "./common/config"
import authRouter from "./modules/auth/auth.module"
import { globalErrorHandler } from "./common/middleware/error.middleware"

export const createApp = () => {
  // Create app instance
  const app = express()

  // middlewares
  app.use(express.json())

  // Routes
  app.get("/health", (_req, res) => {
    res.json({ message: `Server is up and running on port ${config.server.port}` })
  })
  app.use("/auth", authRouter)

  // Global error middleware
  app.use(globalErrorHandler)

  return app
}
