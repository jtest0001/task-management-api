import { Prisma } from "@prisma/client"
import { DbClient } from "../../types/prisma.types"
import { CommentListQuery, CreateCommentData } from "./comment.types"

export class CommentRepository {
  constructor(private readonly db: DbClient) {}

  private readonly buildTaskCommentsWhere = (taskId: string): Prisma.CommentWhereInput => {
    return {
      taskId,
      deletedAt: null
    }
  }

  findByTaskId = (taskId: string, query: CommentListQuery) => {
    return this.db.comment.findMany({
      where: this.buildTaskCommentsWhere(taskId),
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            email: true
          }
        }
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: [
        {
          createdAt: "asc"
        },
        {
          id: "asc"
        }
      ]
    })
  }

  countByTaskId = (taskId: string) => {
    return this.db.comment.count({
      where: this.buildTaskCommentsWhere(taskId)
    })
  }

  create = (data: CreateCommentData) => {
    return this.db.comment.create({
      data,
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            email: true
          }
        }
      }
    })
  }
}
