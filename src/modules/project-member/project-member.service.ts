import { NotFoundError } from "../../common/errors"
import { ProjectMemberRepository } from "./project-member.repository"

export class ProjectMemberService {
  constructor(private readonly projectMemberRepository: ProjectMemberRepository) {}

  getMembers = async (projectId: string, userId: string) => {
    const membership = await this.projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
    if (!membership) throw new NotFoundError("Project not found")

    return this.projectMemberRepository.findByProjectId(projectId)
  }
}
