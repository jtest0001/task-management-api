import { ProjectRepository } from "./../project/project.repository"
import { prisma } from "../../common/database/prisma"
import { TaskController } from "./task.controller"
import { TaskRepository } from "./task.repository"
import { createTaskRoutes } from "./task.routes"
import { TaskService } from "./task.service"
import { ProjectMemberRepository } from "../project-member/project-member.repository"

const taskRepository = new TaskRepository(prisma)
const projectRepository = new ProjectRepository(prisma)
const projectMemberRepository = new ProjectMemberRepository(prisma)
const taskService = new TaskService(taskRepository, projectRepository, projectMemberRepository)
const taskController = new TaskController(taskService)

export const taskRouter = createTaskRoutes(taskController)
