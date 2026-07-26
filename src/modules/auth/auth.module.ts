import { prisma } from "../../common/database/prisma"
import { AuthController } from "./auth.controller"
import { AuthRepository } from "./auth.repository"
import { createAuthRoutes } from "./auth.routes"
import { AuthService } from "./auth.service"
import { SessionRepository } from "./session.repository"

const authRepository = new AuthRepository(prisma)
const sessionRepository = new SessionRepository(prisma)
const authService = new AuthService(authRepository, sessionRepository)
const authController = new AuthController(authService)

export const authRouter = createAuthRoutes(authController)
