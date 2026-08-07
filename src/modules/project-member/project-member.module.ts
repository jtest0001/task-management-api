import { prisma } from "../../common/database/prisma"
import { AuthRepository } from "../auth/auth.repository"
import { TaskRepository } from "../task/task.repository"
import { ProjectMemberController } from "./project-member.controller"
import { ProjectMemberRepository } from "./project-member.repository"
import { createProjectMemberRoutes } from "./project-member.routes"
import { ProjectMemberService } from "./project-member.service"

const projectMemberRepository = new ProjectMemberRepository(prisma)
const authRepository = new AuthRepository(prisma)
const taskRepository = new TaskRepository(prisma)
const projectMemberService = new ProjectMemberService(prisma, projectMemberRepository, authRepository, taskRepository)
const projectMemberController = new ProjectMemberController(projectMemberService)

export const projectMemberRouter = createProjectMemberRoutes(projectMemberController)
