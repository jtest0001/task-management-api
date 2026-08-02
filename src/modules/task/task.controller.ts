import { Request, Response } from "express"
import { requireUser } from "../../common/utils/require-user"
import { TaskService } from "./task.service"
import { TaskQuerySchema } from "./validators/task-query.schema"

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  getProjectTasks = async (req: Request<{ projectId: string }>, res: Response) => {
    const { id: userId } = requireUser(req)
    const { projectId } = req.params
    const query = TaskQuerySchema.parse(req.query)
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
    const task = await this.taskService.createTask(req.body, projectId, userId)

    res.status(201).json(task)
  }

  updateTask = async (req: Request<{ taskId: string }>, res: Response) => {
    const { id: userId } = requireUser(req)
    const { taskId } = req.params
    const task = await this.taskService.updateTask(req.body, taskId, userId)

    res.status(200).json(task)
  }

  deleteTask = async (req: Request<{ taskId: string }>, res: Response) => {
    const { id: userId } = requireUser(req)
    const { taskId } = req.params
    await this.taskService.deleteTask(taskId, userId)

    res.status(204).send()
  }
}
