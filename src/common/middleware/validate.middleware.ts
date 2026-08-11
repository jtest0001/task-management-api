import { RequestHandler } from "express"
import { ZodObject } from "zod"

type ValidationTarget = "body" | "params" | "query" | "cookies"
export const validate =
  (schema: ZodObject, target: ValidationTarget = "body"): RequestHandler =>
  (req, _res, next) => {
    try {
      const parsed = schema.parse(req[target])
      req.validated ??= {}
      req.validated[target] = parsed
      next()
    } catch (error) {
      next(error)
    }
  }
