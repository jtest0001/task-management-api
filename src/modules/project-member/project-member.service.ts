import { ConflictError, ForbiddenError, NotFoundError } from "../../common/errors"
import { AuthRepository } from "../auth/auth.repository"
import { ProjectMemberRepository } from "./project-member.repository"
import { CreateProjectMemberData } from "./project-member.types"
import { AddMemberDto } from "./validators/add-member.schema"
import { UpdateMemberRoleDto } from "./validators/update-member-role.schema"

export class ProjectMemberService {
  constructor(
    private readonly projectMemberRepository: ProjectMemberRepository,
    private readonly authRepository: AuthRepository
  ) {}

  getMembers = async (projectId: string, userId: string) => {
    const membership = await this.projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
    if (!membership) throw new NotFoundError("Project not found")

    return this.projectMemberRepository.findByProjectId(projectId)
  }

  addMember = async (projectId: string, userId: string, dto: AddMemberDto) => {
    const currentUserMembership = await this.projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
    if (!currentUserMembership) throw new NotFoundError("Project not found")
    if (currentUserMembership.role !== "OWNER" && currentUserMembership.role !== "ADMIN") {
      throw new ForbiddenError("Access denied")
    }

    const userToBeAdded = await this.authRepository.findByEmail(dto.email)
    if (!userToBeAdded) throw new NotFoundError("User not found")

    const existingMembership = await this.projectMemberRepository.findByProjectIdAndUserId(projectId, userToBeAdded.id)
    if (existingMembership) throw new ConflictError("User is already a project member")

    const addMemberData = {
      userId: userToBeAdded.id,
      role: "MEMBER",
      projectId
    } satisfies CreateProjectMemberData

    return this.projectMemberRepository.create(addMemberData)
  }

  updateMemberRole = async (projectId: string, userId: string, memberId: string, dto: UpdateMemberRoleDto) => {
    const requesterMembership = await this.projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
    if (!requesterMembership) throw new NotFoundError("Project not found")
    if (requesterMembership.role !== "OWNER") {
      throw new ForbiddenError("Access denied")
    }

    const targetMembership = await this.projectMemberRepository.findByProjectIdAndUserId(projectId, memberId)
    if (!targetMembership) throw new NotFoundError("Member not found")
    if (targetMembership.role === "OWNER") throw new ForbiddenError("Project owner role cannot be changed")

    return this.projectMemberRepository.updateRole(projectId, memberId, dto.role)
  }
}
