import { ConflictError, NotFoundError } from "../../common/errors"
import { LabelRepository } from "../label/label.repository"
import { ProjectMemberRepository } from "../project-member/project-member.repository"
import { TaskRepository } from "../task/task.repository"
import { TaskLabelRepository } from "./task-label.repository"

export class TaskLabelService {
  constructor(
    private readonly taskLabelRepository: TaskLabelRepository,
    private readonly taskRepository: TaskRepository,
    private readonly labelRepository: LabelRepository
  ) {}

  attachLabelToTask = async (taskId: string, userId: string, labelId: string) => {
    const task = await this.taskRepository.findByTaskIdAndUserId(taskId, userId)
    if (!task) throw new NotFoundError("Task not found")

    const label = await this.labelRepository.findById(labelId)
    if (!label) throw new NotFoundError("Label not found")

    if (label.projectId !== task.projectId) {
      throw new NotFoundError("Label not found")
    }

    const existingTaskLabel = await this.taskLabelRepository.findByTaskIdAndLabelId(taskId, labelId)

    if (existingTaskLabel) {
      throw new ConflictError("Label already attached to task")
    }

    return this.taskLabelRepository.create(taskId, labelId)
  }

  detachLabelFromTask = async (taskId: string, userId: string, labelId: string) => {
    const task = await this.taskRepository.findByTaskIdAndUserId(taskId, userId)
    if (!task) throw new NotFoundError("Task not found")

    const label = await this.labelRepository.findById(labelId)
    if (!label) throw new NotFoundError("Label not found")

    if (label.projectId !== task.projectId) {
      throw new NotFoundError("Label not found")
    }

    return this.taskLabelRepository.delete(taskId, labelId)
  }
}
