import { PaginationQuery } from "../../types/query.types"

export interface CommentListQuery extends PaginationQuery {}
export interface CreateCommentData {
  content: string
  authorId: string
  taskId: string
}

export interface UpdateCommentData {
  content: string
}
