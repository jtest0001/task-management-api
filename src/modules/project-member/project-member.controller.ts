import { Request, Response } from "express"
import { requireUser } from "../../common/utils/require-user"
import { ProjectMemberService } from "./project-member.service"
import { ProjectParamsDto } from "../project/validators/project-params.schema"

export class ProjectMemberController {
  constructor(private readonly projectMemberService: ProjectMemberService) {}

  getMembers = async (req: Request, res: Response) => {
    const { id: userId } = requireUser(req)
    const { projectId } = req.validated!.params as ProjectParamsDto
    const members = await this.projectMemberService.getMembers(projectId, userId)

    res.status(200).json({
      data: members
    })
  }
}
