import { Request } from "express"
import { UnauthorizedError } from "../errors"

export function requireUser(req: Request) {
  if (!req.user) {
    throw new UnauthorizedError()
  }

  return req.user
}
