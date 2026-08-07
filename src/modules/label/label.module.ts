import { prisma } from "../../common/database/prisma"
import { ProjectMemberRepository } from "../project-member/project-member.repository"
import { ProjectRepository } from "../project/project.repository"
import { LabelController } from "./label.controller"
import { LabelRepository } from "./label.repository"
import { createLabelRoutes } from "./label.routes"
import { LabelService } from "./label.service"

const labelRepository = new LabelRepository(prisma)
const projectRepository = new ProjectRepository(prisma)
const projectMemberRepository = new ProjectMemberRepository(prisma)
const labelService = new LabelService(labelRepository, projectRepository, projectMemberRepository)
const labelController = new LabelController(labelService)

export const labelRouter = createLabelRoutes(labelController)
