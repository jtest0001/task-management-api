import { prisma } from "../../common/database/prisma"
import { AuthController } from "./auth.controller"
import { AuthRepository } from "./auth.repository"
import { createAuthRoutes } from "./auth.routes"
import { AuthService } from "./auth.service"

const repository = new AuthRepository(prisma)
const service = new AuthService(repository)
const controller = new AuthController(service)
const authRouter = createAuthRoutes(controller)

export default authRouter
