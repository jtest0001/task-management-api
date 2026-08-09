import { ErrorRequestHandler } from "express"
import { AppError } from "../errors"
import { ZodError } from "zod"
import { logger } from "../logger"
import { Prisma } from "@prisma/client"

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
    const { fieldErrors, formErrors } = error.flatten()
    reqLogger.error({
      statusCode: 400,
      message: "Validation failed",
      fieldErrors,
      formErrors
    })

    return res.status(400).json({
      message: "Validation failed",
      fieldErrors,
      formErrors
    })
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        reqLogger.error({
          statusCode: 409,
          code: error.code,
          target: error.meta?.target
        })

        return res.status(409).json({
          message: "Resource already exists"
        })

      case "P2025":
        reqLogger.error({
          statusCode: 404,
          code: error.code
        })

        return res.status(404).json({
          message: "Resource not found"
        })
      case "P2034":
        reqLogger.error({
          statusCode: 409,
          code: error.code
        })

        return res.status(409).json({
          message: "The operation could not be completed due to a concurrent update. Please try again."
        })
    }
  }

  reqLogger.error(
    {
      err: error
    },
    "Unhandled exception"
  )
  res.status(500).json({
    message: "Internal server error"
  })
}
