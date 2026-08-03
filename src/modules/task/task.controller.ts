import { Request, Response } from "express"
import { requireUser } from "../../common/utils/require-user"
import { TaskService } from "./task.service"
import { CreateTaskDto } from "./validators/create-task.schema"
import { TaskQueryDto } from "./validators/task-query.schema"
import { UpdateTaskDto } from "./validators/update-task.schema"

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  getProjectTasks = async (req: Request<{ projectId: string }>, res: Response) => {
    const { id: userId } = requireUser(req)
    const { projectId } = req.params
    const query = req.validated!.query as TaskQueryDto
    const tasks = await this.taskService.getProjectTasks(projectId, userId, query)

    res.status(200).json(tasks)
  }

  getTask = async (req: Request<{ taskId: string }>, res: Response) => {
    const { id: userId } = requireUser(req)
    const { taskId } = req.params
    const tasks = await this.taskService.getTask(taskId, userId)

    res.status(200).json(tasks)
  }

  createTask = async (req: Request<{ projectId: string }>, res: Response) => {
    const { id: userId } = requireUser(req)
    const { projectId } = req.params
    const dto = req.validated!.body as CreateTaskDto
    const task = await this.taskService.createTask(projectId, userId, dto)

    res.status(201).json(task)
  }

  updateTask = async (req: Request<{ taskId: string }>, res: Response) => {
    const { id: userId } = requireUser(req)
    const { taskId } = req.params
    const dto = req.validated!.body as UpdateTaskDto
    const task = await this.taskService.updateTask(taskId, userId, dto)

    res.status(200).json(task)
  }

  deleteTask = async (req: Request<{ taskId: string }>, res: Response) => {
    const { id: userId } = requireUser(req)
    const { taskId } = req.params
    await this.taskService.deleteTask(taskId, userId)

    res.status(204).send()
  }
}
