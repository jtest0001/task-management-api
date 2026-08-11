import "express"
import { Logger } from "pino"

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
      logger: Logger
      validated?: {
        body?: unknown
        query?: unknown
        params?: unknown
        cookies?: unknown
      }
    }
  }
}

export {}
