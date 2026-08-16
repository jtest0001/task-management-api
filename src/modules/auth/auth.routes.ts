import { Router } from "express"
import { authLimiter, refreshLimiter } from "../../common/config/express-rate-limiter.config"
import { authenticate } from "../../common/middleware/authenticate.middleware"
import { validate } from "../../common/middleware/validate.middleware"
import { AuthController } from "./auth.controller"
import { LoginSchema } from "./validators/login.schema"
import { RefreshSchema } from "./validators/refresh.schema"
import { RegisterSchema } from "./validators/register.schema"

export const createAuthRoutes = (controller: AuthController) => {
  const router = Router()

  router.get("/me", authenticate, controller.me)
  router.post("/refresh", refreshLimiter, validate(RefreshSchema, "cookies"), controller.refresh)
  router.post("/register", authLimiter, validate(RegisterSchema), controller.register)
  router.post("/login", authLimiter, validate(LoginSchema), controller.login)
  router.post("/logout", controller.logout)
  router.post("/logout-all", controller.logoutAll)

  return router
}
