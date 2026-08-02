import { Router } from "express"
import { authenticate } from "../../common/middleware/authenticate.middleware"
import { ProjectController } from "./project.controller"
import { ProjectParamsSchema } from "./validators/project-params.schema"
import { validate } from "../../common/middleware/validate.middleware"
import { CreateProjectSchema } from "./validators/create-project.schema"
import { UpdateProjectSchema } from "./validators/update-project.schema"

export const createProjectRoutes = (controller: ProjectController) => {
  const router = Router()

  router.get("/", authenticate, controller.getProjects)
  router.get("/:projectId", authenticate, validate(ProjectParamsSchema, "params"), controller.getProject)
  router.post("/", authenticate, validate(CreateProjectSchema), controller.createProject)
  router.patch(
    "/:projectId",
    authenticate,
    validate(ProjectParamsSchema, "params"),
    validate(UpdateProjectSchema),
    controller.updateProject
  )
  router.delete("/:projectId", authenticate, validate(ProjectParamsSchema, "params"), controller.deleteProject)

  return router
}
