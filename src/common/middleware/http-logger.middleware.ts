import { RequestHandler } from "express"

export const httpLoggerMiddleware: RequestHandler = (req, res, next) => {
  const start = Date.now()

  req.logger.info("Incoming request")

  res.on("finish", () => {
    const duration = Date.now() - start

    req.logger.info(
      {
        statusCode: res.statusCode,
        duration
      },
      "Request completed"
    )
  })

  next()
}
