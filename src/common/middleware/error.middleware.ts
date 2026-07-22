import { ErrorRequestHandler } from "express"
import { AppError } from "../errors"
import { logger } from "../logger"
import { ZodError } from "zod"

export const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  logger.error(error)

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message
    })
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.flatten().fieldErrors
    })
  }

  res.status(500).json({
    message: "Internal server error"
  })
}
