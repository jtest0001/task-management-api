import { Router } from "express"
import { AuthController } from "./auth.controller"
import { validate } from "../../common/middleware/validate.middleware"
import { RegisterSchema } from "./validators/register.schema"
import { LoginSchema } from "./validators/login.schema"

export const createAuthRoutes = (controller: AuthController) => {
  const router = Router()

  router.post("/register", validate(RegisterSchema), controller.register)
  router.post("/login", validate(LoginSchema), controller.login)

  return router
}
