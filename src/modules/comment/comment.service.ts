import { NotFoundError } from "../../common/errors/not-found.error"
import { TaskRepository } from "../task/task.repository"
import { CommentRepository } from "./comment.repository"
import { CreateCommentData } from "./comment.types"
import { CommentQueryDto } from "./validators/comment-query.schema"
import { CreateCommentDto } from "./validators/create-comment.schema"

export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly taskRepository: TaskRepository
  ) {}

  getComments = async (taskId: string, userId: string, query: CommentQueryDto) => {
    const task = await this.taskRepository.findByTaskIdAndUserId(taskId, userId)
    if (!task) throw new NotFoundError("Task not found")

    const commentListQuery = {
      page: query.page,
      limit: query.limit
    }
    const [comments, total] = await Promise.all([
      this.commentRepository.findByTaskId(task.id, commentListQuery),
      this.commentRepository.countByTaskId(task.id)
    ])
    return {
      data: comments,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
        total
      }
    }
  }

  createComment = async (taskId: string, userId: string, dto: CreateCommentDto) => {
    const task = await this.taskRepository.findByTaskIdAndUserId(taskId, userId)
    if (!task) throw new NotFoundError("Task not found")

    const createCommentData: CreateCommentData = {
      content: dto.content,
      authorId: userId,
      taskId: task.id
    }

    const comment = await this.commentRepository.create(createCommentData)
    return {
      data: comment
    }
  }
}
