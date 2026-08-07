import { Prisma } from "@prisma/client"
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

  delete = (projectId: string, userId: string, db: DbClient = this.db) => {
    return db.projectMember.delete({
      where: {
        userId_projectId: {
          projectId,
          userId
        }
      }
    })
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
