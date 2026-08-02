import { RequestHandler } from "express"
import { ZodObject } from "zod"

type ValidationTarget = "body" | "params" | "query"
export const validate =
  (schema: ZodObject, target: ValidationTarget = "body"): RequestHandler =>
  (req, _res, next) => {
    try {
      const data = req[target]
      schema.parse(data)
      next()
    } catch (error) {
      next(error)
    }
  }
