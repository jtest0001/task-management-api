import { Router } from "express"
import { TaskLabelController } from "./task-label.controller"
import { authenticate } from "../../common/middleware/authenticate.middleware"
import { validate } from "../../common/middleware/validate.middleware"
import { TaskLabelParamsSchema } from "./validators/task-label-params.schema"

export const createTaskLabelRoutes = (taskLabelController: TaskLabelController) => {
  const router = Router()

  router.post(
    "/:taskId/labels/:labelId",
    authenticate,
    validate(TaskLabelParamsSchema),
    taskLabelController.attachLabelToTask
  )
  router.delete(
    "/:taskId/labels/:labelId",
    authenticate,
    validate(TaskLabelParamsSchema),
    taskLabelController.detachLabelFromTask
  )

  return router
}
