import { DbClient } from "../../types/prisma.types"
import { CreateProjectMemberData } from "./project.types"

export class ProjectMemberRepository {
  constructor(private readonly db: DbClient) {}

  create = (data: CreateProjectMemberData, db: DbClient = this.db) => {
    return db.projectMember.create({ data })
  }

  findByProjectIdAndUserId = (projectId: string, userId: string) => {
    return this.db.projectMember.findUnique({
      where: {
        userId_projectId: {
          projectId,
          userId
        },
        project: {
          deletedAt: null
        }
      }
    })
  }
}
