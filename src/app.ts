import express from "express"
import { config } from "./common/config/config"

export const createApp = () => {
  // Create app instance
  const app = express()

  // middlewares
  app.use(express.json())

  // Security middleware
  // app.use(helmet());

  // CORS
  // app.use(cors());

  // Logging middleware
  // app.use(requestLogger);

  // Routes
  app.get("/health", (_req, res) => {
    res.json({ message: `Server is up and running on port ${config.server.port}` })
  })

  // 404 handler

  // Global error handler

  // Graceful shutdown
  return app
}
