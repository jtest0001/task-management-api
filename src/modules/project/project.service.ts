import { PrismaClient } from "@prisma/client"
import { NotFoundError, ForbiddenError } from "../../common/errors"
import { ProjectMemberRepository } from "../project-member/project-member.repository"
import { ProjectRepository } from "./project.repository"
import { CreateProjectDto } from "./validators/create-project.schema"
import { UpdateProjectDto } from "./validators/update-project.schema"
import { CreateProjectData, UpdateProjectData } from "./project.types"

export class ProjectService {
  constructor(
    private readonly db: PrismaClient,
    private readonly projectRepository: ProjectRepository,
    private readonly projectMemberRepository: ProjectMemberRepository
  ) {}

  private async ensureProjectOwner(projectId: string, userId: string) {
    const projectMembership = await this.projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
    if (!projectMembership) throw new NotFoundError("Project not found")
    if (projectMembership.role !== "OWNER") throw new ForbiddenError("Access Denied")
  }

  getProjects = (userId: string) => {
    return this.projectRepository.findByUserId(userId)
  }

  getProject = async (projectId: string, userId: string) => {
    const project = await this.projectRepository.findByProjectIdUserId(projectId, userId)
    if (!project) throw new NotFoundError("Project not found")

    return project
  }

  createProject = (userId: string, createProjectDto: CreateProjectDto) => {
    return this.db.$transaction(async (tx) => {
      const createProjectData: CreateProjectData = {
        name: createProjectDto.name,
        description: createProjectDto.description,
        ownerId: userId
      }
      const project = await this.projectRepository.create(createProjectData, tx)
      const projectMemberData = {
        projectId: project.id,
        role: "OWNER" as const,
        userId
      }
      await this.projectMemberRepository.create(projectMemberData, tx)

      return project
    })
  }

  updateProject = async (projectId: string, userId: string, updateProjectDto: UpdateProjectDto) => {
    await this.ensureProjectOwner(projectId, userId)
    const updateProjectData: UpdateProjectData = {
      name: updateProjectDto.name,
      description: updateProjectDto.description
    }
    return this.projectRepository.update(projectId, updateProjectData)
  }

  deleteProject = async (projectId: string, userId: string) => {
    await this.ensureProjectOwner(projectId, userId)
    return this.projectRepository.softDelete(projectId)
  }
}
