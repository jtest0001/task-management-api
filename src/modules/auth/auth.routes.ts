import { Router } from "express"
import { AuthController } from "./auth.controller"
import { validate } from "../../common/middleware/validate.middleware"
import { RegisterSchema } from "./validators/register.schema"

export const createAuthRoutes = (controller: AuthController) => {
  const router = Router()

  router.post("/register", validate(RegisterSchema), controller.register)

  return router
}
