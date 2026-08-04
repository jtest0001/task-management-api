import { Router } from "express"
import { ProjectMemberController } from "./project-member.controller"
import { authenticate } from "../../common/middleware/authenticate.middleware"
import { ProjectParamsSchema } from "../project/validators/project-params.schema"
import { validate } from "../../common/middleware/validate.middleware"
import { AddMemberSchema } from "./validators/add-member.schema"
import { UpdateMemberRoleParamsSchema } from "./validators/update-member-role-params.schema"
import { UpdateMemberRoleSchema } from "./validators/update-member-role.schema"

export const createProjectMemberRoutes = (controller: ProjectMemberController) => {
  const router = Router()

  router.get(
    "/projects/:projectId/members",
    authenticate,
    validate(ProjectParamsSchema, "params"),
    controller.getMembers
  )
  router.post(
    "/projects/:projectId/members",
    authenticate,
    validate(ProjectParamsSchema, "params"),
    validate(AddMemberSchema),
    controller.addMember
  )
  router.patch(
    "/projects/:projectId/members/:memberId",
    authenticate,
    validate(UpdateMemberRoleParamsSchema, "params"),
    validate(UpdateMemberRoleSchema),
    controller.updateMemberRole
  )

  return router
}
