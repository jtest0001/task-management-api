import { DbClient } from "../../types/prisma.types"
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
