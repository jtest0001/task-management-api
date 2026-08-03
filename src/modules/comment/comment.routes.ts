import { authenticate } from "./../../common/middleware/authenticate.middleware"
import { Router } from "express"
import { CommentController } from "./comment.controller"
import { validate } from "../../common/middleware/validate.middleware"
import { TaskParamsSchema } from "../task/validators/task-params.schema"
import { CommentQuerySchema } from "./validators/comment-query.schema"

export const createCommentRoutes = (controller: CommentController) => {
  const router = Router()

  router.get(
    "/tasks/:taskId/comments",
    authenticate,
    validate(TaskParamsSchema, "params"),
    validate(CommentQuerySchema, "query"),
    controller.getTaskComments
  )

  return router
}
