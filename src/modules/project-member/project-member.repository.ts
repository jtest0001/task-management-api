import { DbClient } from "../../types/prisma.types"
import { CreateProjectMemberData } from "./project-member.types"

export class ProjectMemberRepository {
  constructor(private readonly db: DbClient) {}

  create = (data: CreateProjectMemberData, db: DbClient = this.db) => {
    return db.projectMember.create({
      data,
      select: {
        role: true,
        joinedAt: true,
        user: {
          select: {
            id: true,
            email: true
          }
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
      select: {
        role: true,
        joinedAt: true,
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
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
      select: {
        userId: true,
        role: true
      }
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
      select: {
        role: true,
        joinedAt: true,
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
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
