import { Request, Response } from "express"
import { requireUser } from "../../common/utils/require-user"
import { ProjectMemberService } from "./project-member.service"
import { ProjectParamsDto } from "../project/validators/project-params.schema"
import { AddMemberDto } from "./validators/add-member.schema"
import { UpdateMemberRoleDto } from "./validators/update-member-role.schema"
import { UpdateMemberRoleParamsDto } from "./validators/update-member-role-params.schema"

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

  addMember = async (req: Request, res: Response) => {
    const { id: userId } = requireUser(req)
    const { projectId } = req.validated!.params as ProjectParamsDto
    const addMemberDto = req.validated!.body as AddMemberDto
    const member = await this.projectMemberService.addMember(projectId, userId, addMemberDto)

    res.status(201).json(member)
  }

  updateMemberRole = async (req: Request, res: Response) => {
    const { id: userId } = requireUser(req)
    const { projectId, memberId } = req.validated!.params as UpdateMemberRoleParamsDto
    const updateMemberRoleDto = req.validated!.body as UpdateMemberRoleDto
    const member = await this.projectMemberService.updateMemberRole(projectId, userId, memberId, updateMemberRoleDto)

    res.status(200).json(member)
  }
}
