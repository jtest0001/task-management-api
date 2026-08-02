import { BadRequestError } from "../../common/errors/bad-request.error"
import { NotFoundError } from "../../common/errors/not-found.error"
import { ProjectMemberRepository } from "../project/project-member.repository"
import { ProjectRepository } from "../project/project.repository"
import { TaskRepository } from "./task.repository"
import { UpdateTaskData } from "./task.types"
import { CreateTaskDto } from "./validators/create-task.schema"
import { TaskQueryDto } from "./validators/task-query.schema"
import { UpdateTaskDto } from "./validators/update-task.schema"
import isUndefined from "lodash/isUndefined"
import omitBy from "lodash/omitBy"

export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly projectMemberRepository: ProjectMemberRepository
  ) {}

  getProjectTasks = async (projectId: string, userId: string, query: TaskQueryDto) => {
    const project = await this.projectRepository.findByProjectIdUserId(projectId, userId)
    if (!project) throw new NotFoundError("Project not found")

    const [tasks, total] = await Promise.all([
      this.taskRepository.findByProjectId(projectId, query),
      this.taskRepository.countByProjectId(projectId, query)
    ])

    return {
      data: tasks,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
        total
      }
    }
  }

  getTask = async (taskId: string, userId: string) => {
    const task = await this.taskRepository.findByTaskIdAndUserId(taskId, userId)
    if (!task) throw new NotFoundError("Task not found")

    return task
  }

  createTask = async (dto: CreateTaskDto, projectId: string, userId: string) => {
    const project = await this.projectRepository.findByProjectIdUserId(projectId, userId)
    if (!project) throw new NotFoundError("Project not found")

    if (dto.assigneeId) {
      const member = await this.projectMemberRepository.findByProjectIdAndUserId(projectId, dto.assigneeId)

      if (!member) throw new BadRequestError("The selected assignee is not a member of this project")
    }

    const createTaskData = {
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      projectId,
      assigneeId: dto.assigneeId,
      createdById: userId,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined
    }

    return this.taskRepository.create(createTaskData)
  }

  updateTask = async (dto: UpdateTaskDto, taskId: string, userId: string) => {
    const task = await this.taskRepository.findByTaskIdAndUserId(taskId, userId)
    if (!task) throw new NotFoundError("Task not found")

    if (dto.assigneeId) {
      const member = await this.projectMemberRepository.findByProjectIdAndUserId(task.projectId, dto.assigneeId)

      if (!member) throw new BadRequestError("The selected assignee is not a member of this project")
    }

    let dueDate
    if (dto.dueDate) {
      dueDate = new Date(dto.dueDate)
    }
    if (dto.dueDate === null) {
      dueDate = null
    }

    const updateTaskData = omitBy(
      {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        assigneeId: dto.assigneeId,
        dueDate
      },
      isUndefined
    ) as UpdateTaskData

    return this.taskRepository.update(taskId, updateTaskData)
  }

  deleteTask = async (taskId: string, userId: string) => {
    const task = await this.taskRepository.findByTaskIdAndUserId(taskId, userId)
    if (!task) throw new NotFoundError("Task not found")

    await this.taskRepository.softDelete(taskId)
  }
}
