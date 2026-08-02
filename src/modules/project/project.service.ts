import { PrismaClient } from "@prisma/client"
import { NotFoundError } from "../../common/errors/not-found.error"
import { ProjectMemberRepository } from "./project-member.repository"
import { ProjectRepository } from "./project.repository"
import { CreateProjectDto } from "./validators/create-project.schema"
import { UpdateProjectDto } from "./validators/update-project.schema"
import { ForbiddenError } from "../../common/errors/forbidden.error"

export class ProjectService {
  constructor(
    private readonly db: PrismaClient,
    private readonly projectRepository: ProjectRepository,
    private readonly projectMemberRepository: ProjectMemberRepository
  ) {}

  private async ensureProjectOwner(projectId: string, userId: string) {
    const projectMembership = await this.projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
    if (!projectMembership) throw new NotFoundError("Project not found")
    if (projectMembership.role === "MEMBER") throw new ForbiddenError("Access Denied")
  }

  getProjects = (userId: string) => {
    return this.projectRepository.findByUserId(userId)
  }

  getProject = async (projectId: string, userId: string) => {
    const project = await this.projectRepository.findByProjectIdUserId(projectId, userId)
    if (!project) throw new NotFoundError("Project not found")

    return project
  }

  createProject = (createProjectDto: CreateProjectDto, userId: string) => {
    return this.db.$transaction(async (tx) => {
      const project = await this.projectRepository.create({ ...createProjectDto, ownerId: userId }, tx)
      const projectMemberData = {
        projectId: project.id,
        role: "OWNER" as const,
        userId
      }
      await this.projectMemberRepository.create(projectMemberData, tx)

      return project
    })
  }

  updateProject = async (updateProjectDto: UpdateProjectDto, userId: string, projectId: string) => {
    await this.ensureProjectOwner(projectId, userId)
    return this.projectRepository.update(projectId, updateProjectDto)
  }

  deleteProject = async (projectId: string, userId: string) => {
    await this.ensureProjectOwner(projectId, userId)
    return this.projectRepository.softDelete(projectId)
  }
}
