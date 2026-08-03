import { Router } from "express"
import { validate } from "../../common/middleware/validate.middleware"
import { TaskParamsSchema } from "../task/validators/task-params.schema"
import { authenticate } from "./../../common/middleware/authenticate.middleware"
import { CommentController } from "./comment.controller"
import { CommentQuerySchema } from "./validators/comment-query.schema"
import { CreateCommentSchema } from "./validators/create-comment.schema"

export const createCommentRoutes = (controller: CommentController) => {
  const router = Router()

  router.get(
    "/tasks/:taskId/comments",
    authenticate,
    validate(TaskParamsSchema, "params"),
    validate(CommentQuerySchema, "query"),
    controller.getTaskComments
  )
  router.post(
    "/tasks/:taskId/comments",
    authenticate,
    validate(TaskParamsSchema, "params"),
    validate(CreateCommentSchema),
    controller.createComment
  )

  return router
}
