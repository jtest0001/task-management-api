import { DbClient } from "../../types/prisma.types"
import { TaskQueryDto } from "../task/validators/task-query.schema"
import { CreateProjectData, UpdateProjectData } from "./project.types"

export class ProjectRepository {
  constructor(private readonly db: DbClient) {}

  findByUserId = (userId: string) => {
    return this.db.projectMember.findMany({
      where: {
        userId,
        project: {
          deletedAt: null
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            ownerId: true,
            createdAt: true
          }
        }
      }
    })
  }

  findByProjectIdUserId = (projectId: string, userId: string) => {
    return this.db.project.findFirst({
      where: {
        id: projectId,
        deletedAt: null,
        members: {
          some: {
            userId
          }
        }
      }
    })
  }

  findByProjectIdUserIdWithTasks = (projectId: string, userId: string, query: TaskQueryDto) => {
    return this.db.project.findFirst({
      where: {
        id: projectId,
        deletedAt: null,
        members: {
          some: {
            userId
          }
        }
      },
      include: {
        tasks: {
          where: {
            deletedAt: null,
            ...(query.status && {
              status: query.status
            })
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })
  }

  create = (data: CreateProjectData, db: DbClient = this.db) => {
    return db.project.create({ data })
  }

  update = (projectId: string, data: UpdateProjectData) => {
    return this.db.project.update({ where: { id: projectId }, data })
  }

  softDelete = (projectId: string) => {
    return this.db.project.update({
      where: { id: projectId },
      data: {
        deletedAt: new Date()
      }
    })
  }
}
