import { Request, Response } from "express"
import { TaskLabelService } from "./task-label.service"
import { requireUser } from "../../common/utils/require-user"
import { TaskLabelParamsDto } from "./validators/task-label-params.schema"
import { TaskParamsDto } from "../task/validators/task-params.schema"

export class TaskLabelController {
  constructor(private readonly taskLabelService: TaskLabelService) {}

  getTaskLabels = async (req: Request, res: Response) => {
    const { id: userId } = requireUser(req)
    const { taskId } = req.validated!.params as TaskParamsDto
    const labels = await this.taskLabelService.getTaskLabels(taskId, userId)

    res.status(200).json(labels)
  }

  attachLabelToTask = async (req: Request, res: Response) => {
    const { id: userId } = requireUser(req)
    const { taskId, labelId } = req.validated!.params as TaskLabelParamsDto
    const taskLabel = await this.taskLabelService.attachLabelToTask(taskId, userId, labelId)

    res.status(201).json(taskLabel)
  }

  detachLabelFromTask = async (req: Request, res: Response) => {
    const { id: userId } = requireUser(req)
    const { taskId, labelId } = req.validated!.params as TaskLabelParamsDto
    await this.taskLabelService.detachLabelFromTask(taskId, userId, labelId)

    res.status(204).send()
  }
}
