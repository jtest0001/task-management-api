import { Prisma, ProjectRole } from "@prisma/client"
import { DbClient } from "../../types/prisma.types"
import { CreateProjectMemberData } from "./project-member.types"

export class ProjectMemberRepository {
  constructor(private readonly db: DbClient) {}

  private readonly projectMemberSelect = {
    role: true,
    joinedAt: true,
    user: {
      select: {
        id: true,
        email: true
      }
    }
  } satisfies Prisma.ProjectMemberSelect

  create = (data: CreateProjectMemberData, db: DbClient = this.db) => {
    return db.projectMember.create({
      data,
      select: this.projectMemberSelect
    })
  }

  deleteMany = async (projectId: string, userId: string, roles: ProjectRole[], db: DbClient = this.db) => {
    const result = await db.projectMember.deleteMany({
      where: {
        projectId,
        userId,
        role: {
          in: roles
        }
      }
    })

    return result.count
  }

  updateRole = (projectId: string, userId: string, role: "MEMBER" | "ADMIN") => {
    return this.db.projectMember.update({
      data: {
        role
      },
      where: {
        userId_projectId: {
          projectId,
          userId
        },
        project: {
          deletedAt: null
        },
        user: {
          deletedAt: null
        }
      },
      select: this.projectMemberSelect
    })
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
        },
        user: {
          deletedAt: null
        }
      },
      select: this.projectMemberSelect
    })
  }

  findByProjectId = (projectId: string) => {
    return this.db.projectMember.findMany({
      where: {
        projectId,
        project: {
          deletedAt: null
        },
        user: {
          deletedAt: null
        }
      },
      select: this.projectMemberSelect,
      orderBy: [
        {
          joinedAt: "asc"
        },
        {
          userId: "asc"
        }
      ]
    })
  }
}
