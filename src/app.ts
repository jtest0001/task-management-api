import cookieParser from "cookie-parser"
import express from "express"
import helmet from "helmet"
import { corsConfig } from "./common/config/cors.config"
import { config } from "./common/config/env.config"
import { globalErrorHandler } from "./common/middleware/error.middleware"
import { httpLoggerMiddleware } from "./common/middleware/http-logger.middleware"
import { requestIdMiddleware } from "./common/middleware/request-id.middleware"
import { authRouter } from "./modules/auth/auth.module"
import { commentRouter } from "./modules/comment/comment.module"
import { labelRouter } from "./modules/label/label.module"
import { projectMemberRouter } from "./modules/project-member/project-member.module"
import { projectRouter } from "./modules/project/project.module"
import { taskLabelRouter } from "./modules/task-label/task-label.module"
import { taskRouter } from "./modules/task/task.module"
import { globalLimiter } from "./common/config/express-rate-limiter.config"

export const createApp = () => {
  // Create app instance
  const app = express()

  // middlewares
  app.set("trust proxy", 2)
  app.use(corsConfig)
  app.use(helmet())
  app.use(globalLimiter)
  app.use(requestIdMiddleware)
  app.use(httpLoggerMiddleware)
  app.use(express.json())
  app.use(cookieParser())

  // Routes
  app.get("/health", (_req, res) => {
    res.json({ message: `Server is up and running on port ${config.server.port}` })
  })
  const apiRouter = express.Router()
  apiRouter.use("/auth", authRouter)
  apiRouter.use("/projects", projectRouter)
  apiRouter.use(taskRouter)
  apiRouter.use(commentRouter)
  apiRouter.use(projectMemberRouter)
  apiRouter.use(labelRouter)
  apiRouter.use("/tasks", taskLabelRouter)
  app.use("/api", apiRouter)

  // Global error middleware
  app.use(globalErrorHandler)

  return app
}
