import { Request, Response } from "express"
import { requireUser } from "../../common/utils/require-user"
import { ProjectService } from "./project.service"
import { CreateProjectDto } from "./validators/create-project.schema"
import { UpdateProjectDto } from "./validators/update-project.schema"

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  getProjects = async (req: Request, res: Response) => {
    const { id: userId } = requireUser(req)

    const projects = await this.projectService.getProjects(userId)
    res.status(200).json(projects)
  }

  getProject = async (req: Request<{ projectId: string }>, res: Response) => {
    const { id: userId } = requireUser(req)

    const { projectId } = req.params
    const project = await this.projectService.getProject(projectId, userId)

    res.status(200).json(project)
  }

  createProject = async (req: Request<{}, {}, CreateProjectDto>, res: Response) => {
    const { id: userId } = requireUser(req)
    const dto = req.validated!.body as CreateProjectDto
    const project = await this.projectService.createProject(userId, dto)

    res.status(201).json(project)
  }

  updateProject = async (req: Request<{ projectId: string }, {}, UpdateProjectDto>, res: Response) => {
    const { id: userId } = requireUser(req)

    const { projectId } = req.params
    const dto = req.validated!.body as UpdateProjectDto
    const project = await this.projectService.updateProject(projectId, userId, dto)

    res.status(200).json(project)
  }

  deleteProject = async (req: Request<{ projectId: string }>, res: Response) => {
    const { id: userId } = requireUser(req)

    const { projectId } = req.params
    await this.projectService.deleteProject(projectId, userId)

    res.status(204).send()
  }
}
