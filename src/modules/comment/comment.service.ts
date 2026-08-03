import { NotFoundError } from "../../common/errors/not-found.error"
import { TaskRepository } from "../task/task.repository"
import { CommentRepository } from "./comment.repository"
import { CommentQueryDto } from "./validators/comment-query.schema"

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
}
