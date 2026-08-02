import { Prisma } from "@prisma/client"
import { DbClient } from "../../types/prisma.types"
import { CreateTaskData, TaskListPropertyQuery, TaskListQuery, TaskListSortQuery, UpdateTaskData } from "./task.types"

export class TaskRepository {
  constructor(private readonly db: DbClient) {}

  private buildProjectTasksWhere = (projectId: string, query: TaskListPropertyQuery): Prisma.TaskWhereInput => {
    return {
      projectId,
      deletedAt: null,
      ...(query.status !== undefined && {
        status: query.status
      }),
      ...(query.priority !== undefined && {
        priority: query.priority
      }),
      ...(query.assigneeId !== undefined && {
        assigneeId: query.assigneeId
      }),
      ...(query.search !== undefined && {
        title: {
          contains: query.search,
          mode: "insensitive" as const
        }
      })
    }
  }

  private buildTaskOrderBy = (query: TaskListSortQuery): Prisma.TaskOrderByWithRelationInput[] => {
    if (query.sortBy === "dueDate") {
      return [
        {
          dueDate: {
            sort: query.sortOrder,
            nulls: "last"
          }
        },
        {
          id: query.sortOrder
        }
      ]
    }

    return [
      { [query.sortBy]: query.sortOrder },
      {
        id: query.sortOrder
      }
    ]
  }

  findByProjectId = (projectId: string, query: TaskListQuery) => {
    return this.db.task.findMany({
      where: this.buildProjectTasksWhere(projectId, query),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: this.buildTaskOrderBy(query)
    })
  }

  countByProjectId = (projectId: string, query: TaskListQuery) => {
    return this.db.task.count({
      where: this.buildProjectTasksWhere(projectId, query)
    })
  }

  findByTaskIdAndUserId = (taskId: string, userId: string) => {
    return this.db.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        project: {
          deletedAt: null,
          members: {
            some: {
              userId
            }
          }
        }
      }
    })
  }

  create = (data: CreateTaskData) => {
    return this.db.task.create({ data })
  }

  update = (taskId: string, data: UpdateTaskData) => {
    return this.db.task.update({ where: { id: taskId }, data })
  }

  softDelete = (taskId: string) => {
    return this.db.task.update({
      where: { id: taskId },
      data: {
        deletedAt: new Date()
      }
    })
  }
}
