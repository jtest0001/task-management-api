import "express"
import { Logger } from "pino"
import { HttpLogger } from "pino-http"

declare global {
  namespace Express {
    interface User {
      id: string
      email: string
    }

    interface Request {
      user?: {
        id: string
      }
      requestId: string
      logger: HttpLogger
    }
  }
}

export {}
