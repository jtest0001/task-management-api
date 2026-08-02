import { RequestHandler } from "express"
import { ZodObject } from "zod"

type ValidationTarget = "body" | "params" | "query"
export const validate =
  (schema: ZodObject, target: ValidationTarget = "body"): RequestHandler =>
  (req, _res, next) => {
    try {
      schema.parse(req[target])
      next()
    } catch (error) {
      next(error)
    }
  }
