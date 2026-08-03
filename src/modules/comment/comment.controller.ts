import { Request, Response } from "express"
import { requireUser } from "../../common/utils/require-user"
import { CommentService } from "./comment.service"
import { CommentQueryDto } from "./validators/comment-query.schema"
import { CommentContentDto } from "./validators/create-comment.schema"

export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  getTaskComments = async (req: Request<{ taskId: string }>, res: Response) => {
    const { id: userId } = requireUser(req)
    const { taskId } = req.params
    const query = req.validated!.query as CommentQueryDto
    const comments = await this.commentService.getComments(taskId, userId, query)

    res.status(200).json(comments)
  }

  createComment = async (req: Request<{ taskId: string }>, res: Response) => {
    const { id: userId } = requireUser(req)
    const { taskId } = req.params
    const dto = req.validated!.body as CommentContentDto
    const comment = await this.commentService.createComment(taskId, userId, dto)

    res.status(201).json(comment)
  }

  updateComment = async (req: Request<{ commentId: string }>, res: Response) => {
    const { id: userId } = requireUser(req)
    const { commentId } = req.params
    const dto = req.validated!.body as CommentContentDto
    const comment = await this.commentService.updateComment(commentId, userId, dto)

    res.status(200).json(comment)
  }
}
