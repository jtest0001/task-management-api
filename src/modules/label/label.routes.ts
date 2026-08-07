import { Router } from "express"
import { LabelController } from "./label.controller"
import { authenticate } from "../../common/middleware/authenticate.middleware"
import { ProjectParamsSchema } from "../project/validators/project-params.schema"
import { validate } from "../../common/middleware/validate.middleware"
import { CreateLabelSchema } from "./validators/create-label.schema"
import { LabelParamsSchema } from "./validators/label-params.schema"
import { UpdateLabelSchema } from "./validators/update-label.schema"

export const createLabelRoutes = (controller: LabelController) => {
  const router = Router()

  router.get(
    "/projects/:projectId/labels",
    authenticate,
    validate(ProjectParamsSchema, "params"),
    controller.getProjectLabels
  )
  router.post(
    "/projects/:projectId/labels",
    authenticate,
    validate(ProjectParamsSchema, "params"),
    validate(CreateLabelSchema),
    controller.createProjectLabel
  )
  router.patch(
    "/labels/:labelId",
    authenticate,
    validate(LabelParamsSchema, "params"),
    validate(UpdateLabelSchema),
    controller.updateProjectLabel
  )
  router.delete("/labels/:labelId", authenticate, validate(LabelParamsSchema, "params"), controller.deleteProjectLabel)

  return router
}
