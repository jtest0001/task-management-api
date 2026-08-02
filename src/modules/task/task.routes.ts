import { Router } from "express"
import { authenticate } from "../../common/middleware/authenticate.middleware"
import { validate } from "../../common/middleware/validate.middleware"
import { ProjectParamsSchema } from "../project/validators/project-params.schema"
import { TaskController } from "./task.controller"
import { CreateTaskSchema } from "./validators/create-task.schema"
import { TaskParamsSchema } from "./validators/task-params.schema"
import { UpdateTaskSchema } from "./validators/update-task.schema"
import { TaskQuerySchema } from "./validators/task-query.schema"

export const createTaskRoutes = (controller: TaskController) => {
  const router = Router()

  router.get(
    "/projects/:projectId/tasks",
    authenticate,
    validate(ProjectParamsSchema, "params"),
    validate(TaskQuerySchema, "query"),
    controller.getProjectTasks
  )
  router.get("/tasks/:taskId", authenticate, validate(TaskParamsSchema, "params"), controller.getTask)
  router.post(
    "/projects/:projectId/tasks",
    authenticate,
    validate(ProjectParamsSchema, "params"),
    validate(CreateTaskSchema),
    controller.createTask
  )
  router.patch(
    "/tasks/:taskId",
    authenticate,
    validate(TaskParamsSchema, "params"),
    validate(UpdateTaskSchema),
    controller.updateTask
  )
  router.delete("/tasks/:taskId", authenticate, validate(TaskParamsSchema, "params"), controller.deleteTask)

  return router
}
