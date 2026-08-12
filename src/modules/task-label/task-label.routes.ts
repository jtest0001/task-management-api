import { Router } from "express"
import { TaskLabelController } from "./task-label.controller"
import { authenticate } from "../../common/middleware/authenticate.middleware"
import { validate } from "../../common/middleware/validate.middleware"
import { TaskLabelParamsSchema } from "./validators/task-label-params.schema"
import { TaskParamsSchema } from "../task/validators/task-params.schema"

export const createTaskLabelRoutes = (taskLabelController: TaskLabelController) => {
  const router = Router()

  router.get(
    "/:taskId/labels",
    authenticate,
    validate(TaskParamsSchema, "params"),
    taskLabelController.getTaskLabels
  )
  router.post(
    "/:taskId/labels/:labelId",
    authenticate,
    validate(TaskLabelParamsSchema, "params"),
    taskLabelController.attachLabelToTask
  )
  router.delete(
    "/:taskId/labels/:labelId",
    authenticate,
    validate(TaskLabelParamsSchema, "params"),
    taskLabelController.detachLabelFromTask
  )

  return router
}
