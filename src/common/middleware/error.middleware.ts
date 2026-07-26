import { ErrorRequestHandler } from "express"
import { AppError } from "../errors"
import { ZodError } from "zod"

export const globalErrorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof AppError) {
    req.logger.error({
      statusCode: error.statusCode,
      message: error.message
    })

    return res.status(error.statusCode).json({
      message: error.message
    })
  }

  if (error instanceof ZodError) {
    req.logger.error({
      statusCode: 400,
      message: "Validation failed",
      errors: error.flatten().fieldErrors
    })

    return res.status(400).json({
      message: "Validation failed",
      errors: error.flatten().fieldErrors
    })
  }

  req.logger.error(error)
  res.status(500).json({
    message: "Internal server error"
  })
}
