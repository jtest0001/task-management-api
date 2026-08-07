import { prisma } from "../../common/database/prisma"
import { ProjectMemberRepository } from "../project-member/project-member.repository"
import { ProjectController } from "./project.controller"
import { ProjectRepository } from "./project.repository"
import { createProjectRoutes } from "./project.routes"
import { ProjectService } from "./project.service"

const projectRepository = new ProjectRepository(prisma)
const projectMemberRepository = new ProjectMemberRepository(prisma)
const projectService = new ProjectService(prisma, projectRepository, projectMemberRepository)
const projectController = new ProjectController(projectService)

export const projectRouter = createProjectRoutes(projectController)
