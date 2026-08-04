import { prisma } from "../../common/database/prisma"
import { AuthRepository } from "../auth/auth.repository"
import { ProjectMemberController } from "./project-member.controller"
import { ProjectMemberRepository } from "./project-member.repository"
import { createProjectMemberRoutes } from "./project-member.routes"
import { ProjectMemberService } from "./project-member.service"

const projectMemberRepository = new ProjectMemberRepository(prisma)
const authRepository = new AuthRepository(prisma)
const projectMemberService = new ProjectMemberService(projectMemberRepository, authRepository)
const projectMemberController = new ProjectMemberController(projectMemberService)

export const projectMemberRouter = createProjectMemberRoutes(projectMemberController)
