import { ForbiddenError, NotFoundError } from "../../common/errors"
import { ProjectMemberRepository } from "../project-member/project-member.repository"
import { ProjectRepository } from "../project/project.repository"
import { LabelRepository } from "./label.repository"
import { CreateLabelData } from "./label.types"
import { CreateLabelDto } from "./validators/create-label.schema"
import { UpdateLabelDto } from "./validators/update-label.schema"

export class LabelService {
  constructor(
    private readonly labelRepository: LabelRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly projectMember: ProjectMemberRepository
  ) {}

  private readonly modifyLabelValidation = async (labelId: string, userId: string) => {
    const label = await this.labelRepository.findById(labelId)
    if (!label) throw new NotFoundError("Label not found")

    const membership = await this.projectMember.findByProjectIdAndUserId(label.projectId, userId)
    if (!membership) throw new NotFoundError("Label not found")

    if (membership.role !== "ADMIN" && membership.role !== "OWNER") {
      throw new ForbiddenError("Access Denied")
    }
  }

  getProjectLabels = async (projectId: string, userId: string) => {
    const project = await this.projectRepository.findByProjectIdUserId(projectId, userId)
    if (!project) throw new NotFoundError("Project not found")

    return this.labelRepository.findByProjectId(projectId)
  }

  createProjectLabel = async (projectId: string, userId: string, dto: CreateLabelDto) => {
    const project = await this.projectRepository.findByProjectIdUserId(projectId, userId)
    if (!project) throw new NotFoundError("Project not found")

    const labelData = {
      name: dto.name,
      color: dto.color,
      projectId
    } satisfies CreateLabelData

    return this.labelRepository.create(labelData)
  }

  updateProjectLabel = async (labelId: string, userId: string, dto: UpdateLabelDto) => {
    await this.modifyLabelValidation(labelId, userId)
    return this.labelRepository.update(labelId, dto)
  }

  deleteProjectLabel = async (labelId: string, userId: string) => {
    await this.modifyLabelValidation(labelId, userId)
    return this.labelRepository.delete(labelId)
  }
}
