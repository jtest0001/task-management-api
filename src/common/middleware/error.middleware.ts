import { ErrorRequestHandler } from "express"
import { AppError } from "../errors"
import { logger } from "../logger"

export const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  logger.error(error)

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message
    })
  }

  res.status(500).json({
    message: "Internal server error"
  })
}
