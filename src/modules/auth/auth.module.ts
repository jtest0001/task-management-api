import { prisma } from "../../common/database/prisma"
import { AuthController } from "./auth.controller"
import { AuthRepository } from "./auth.repository"
import { createAuthRoutes } from "./auth.routes"
import { AuthService } from "./auth.service"
import { SessionRepository } from "./session.repository"

const authRepository = new AuthRepository(prisma)
const sessionRepository = new SessionRepository(prisma)
const service = new AuthService(authRepository, sessionRepository)
const controller = new AuthController(service)
const authRouter = createAuthRoutes(controller)

export default authRouter
