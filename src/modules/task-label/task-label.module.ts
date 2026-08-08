import { prisma } from "../../common/database/prisma"
import { LabelRepository } from "../label/label.repository"
import { TaskRepository } from "../task/task.repository"
import { TaskLabelController } from "./task-label.controller"
import { TaskLabelRepository } from "./task-label.repository"
import { createTaskLabelRoutes } from "./task-label.routes"
import { TaskLabelService } from "./task-label.service"

const taskLabelRepository = new TaskLabelRepository(prisma)
const taskRepository = new TaskRepository(prisma)
const labelRepository = new LabelRepository(prisma)
const taskLabelService = new TaskLabelService(taskLabelRepository, taskRepository, labelRepository)
const taskLabelController = new TaskLabelController(taskLabelService)

export const taskLabelRouter = createTaskLabelRoutes(taskLabelController)
