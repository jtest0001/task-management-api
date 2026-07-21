import { RequestHandler } from "express"
import { ZodObject } from "zod"

export const validate =
  (schema: ZodObject): RequestHandler =>
  (req, _res, next) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      next(error)
    }
  }
