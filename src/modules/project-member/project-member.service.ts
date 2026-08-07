import { PrismaClient, ProjectRole } from "@prisma/client"
import { ConflictError, ForbiddenError, NotFoundError } from "../../common/errors"
import { AuthRepository } from "../auth/auth.repository"
import { ProjectMemberRepository } from "./project-member.repository"
import { CreateProjectMemberData } from "./project-member.types"
import { AddMemberDto } from "./validators/add-member.schema"
import { UpdateMemberRoleDto } from "./validators/update-member-role.schema"
import { TaskRepository } from "../task/task.repository"

export class ProjectMemberService {
  constructor(
    private readonly db: PrismaClient,
    private readonly projectMemberRepository: ProjectMemberRepository,
    private readonly authRepository: AuthRepository,
    private readonly taskRepository: TaskRepository
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

  removeProjectMember = async (projectId: string, userId: string, memberId: string) => {
    await this.db.$transaction(
      async (tx) => {
        const requesterMembership = await this.projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
        if (!requesterMembership) throw new NotFoundError("Project not found")

        const targetMembership = await this.projectMemberRepository.findByProjectIdAndUserId(projectId, memberId)
        if (!targetMembership) throw new NotFoundError("Member not found")
        if (targetMembership.role === "OWNER") throw new ForbiddenError("Project owner cannot be removed")

        const requesterCanManageMembers = requesterMembership.role === "OWNER" || requesterMembership.role === "ADMIN"
        if (!requesterCanManageMembers) {
          throw new ForbiddenError("Access denied")
        }

        if (targetMembership.role === "ADMIN" && requesterMembership.role !== "OWNER") {
          throw new ForbiddenError("Access denied")
        }

        const allowedTargetRoles: ProjectRole[] =
          requesterMembership.role === "OWNER" ? ["MEMBER", "ADMIN"] : ["MEMBER"]
        const deletedCount = await this.projectMemberRepository.deleteMany(projectId, memberId, allowedTargetRoles, tx)
        if (deletedCount === 0) {
          throw new ForbiddenError("You cannot remove this project member")
        }

        await this.taskRepository.unassignByProjectIdAndAssigneeId(projectId, memberId, tx)
      },
      {
        isolationLevel: "Serializable"
      }
    )
  }
}
