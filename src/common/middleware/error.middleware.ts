import { ErrorRequestHandler } from "express"
import { AppError } from "../errors"
import { ZodError } from "zod"
import { logger } from "../logger"

export const globalErrorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const reqLogger = req.logger ?? logger

  if (error instanceof AppError) {
    reqLogger.error({
      statusCode: error.statusCode,
      message: error.message
    })

    return res.status(error.statusCode).json({
      message: error.message
    })
  }

  if (error instanceof ZodError) {
    reqLogger.error({
      statusCode: 400,
      message: "Validation failed",
      errors: error.flatten().fieldErrors
    })

    return res.status(400).json({
      message: "Validation failed",
      errors: error.flatten().fieldErrors
    })
  }

  reqLogger.error(error)
  res.status(500).json({
    message: "Internal server error"
  })
}
