import { prisma } from "../../common/database/prisma"
import { ProjectMemberController } from "./project-member.controller"
import { ProjectMemberRepository } from "./project-member.repository"
import { createProjectMemberRoutes } from "./project-member.routes"
import { ProjectMemberService } from "./project-member.service"

const projectMemberRepository = new ProjectMemberRepository(prisma)
const projectMemberService = new ProjectMemberService(projectMemberRepository)
const projectMemberController = new ProjectMemberController(projectMemberService)

export const projectMemberRouter = createProjectMemberRoutes(projectMemberController)
