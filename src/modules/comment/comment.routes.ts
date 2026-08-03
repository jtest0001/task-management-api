import { Router } from "express"
import { validate } from "../../common/middleware/validate.middleware"
import { TaskParamsSchema } from "../task/validators/task-params.schema"
import { authenticate } from "./../../common/middleware/authenticate.middleware"
import { CommentController } from "./comment.controller"
import { CommentQuerySchema } from "./validators/comment-query.schema"
import { CommentContentSchema } from "./validators/create-comment.schema"
import { CommentParamsSchema } from "./validators/comment-params.schema"

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
    validate(CommentContentSchema),
    controller.createComment
  )
  router.patch(
    "/comments/:commentId",
    authenticate,
    validate(CommentParamsSchema, "params"),
    validate(CommentContentSchema),
    controller.updateComment
  )

  return router
}
