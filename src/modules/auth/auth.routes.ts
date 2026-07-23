import { Router } from "express"
import { AuthController } from "./auth.controller"
import { validate } from "../../common/middleware/validate.middleware"
import { RegisterSchema } from "./validators/register.schema"
import { LoginSchema } from "./validators/login.schema"
import { authenticate } from "../../common/middleware/authenticate.middleware"
import { RefreshSchema } from "./validators/refresh.schema"

export const createAuthRoutes = (controller: AuthController) => {
  const router = Router()

  router.get("/me", authenticate, controller.me)
  router.post("/refresh", validate(RefreshSchema), controller.refresh)
  router.post("/register", validate(RegisterSchema), controller.register)
  router.post("/login", validate(LoginSchema), controller.login)
  router.post("/logout", controller.logout)
  router.post("/logout-all", controller.logoutAll)

  return router
}
