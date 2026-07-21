import express from "express"

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
  // app.use("/api/auth", authRoutes);
  // app.use("/api/tasks", taskRoutes);

  // 404 handler

  // Global error handler

  // Graceful shutdown
  return app
}
