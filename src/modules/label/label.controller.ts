import { Request, Response } from "express"
import { LabelService } from "./label.service"
import { requireUser } from "../../common/utils/require-user"
import { ProjectParamsDto } from "../project/validators/project-params.schema"
import { CreateLabelDto } from "./validators/create-label.schema"
import { UpdateLabelDto } from "./validators/update-label.schema"
import { LabelParamsDto } from "./validators/label-params.schema"

export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  getProjectLabels = async (req: Request, res: Response) => {
    const { id: userId } = requireUser(req)
    const { projectId } = req.validated!.params as ProjectParamsDto
    const labels = await this.labelService.getProjectLabels(projectId, userId)

    res.status(200).json(labels)
  }

  createProjectLabel = async (req: Request, res: Response) => {
    const { id: userId } = requireUser(req)
    const { projectId } = req.validated!.params as ProjectParamsDto
    const dto = req.validated!.body as CreateLabelDto
    const label = await this.labelService.createProjectLabel(projectId, userId, dto)

    res.status(201).json(label)
  }

  updateProjectLabel = async (req: Request, res: Response) => {
    const { id: userId } = requireUser(req)
    const { labelId } = req.validated!.params as LabelParamsDto
    const dto = req.validated!.body as UpdateLabelDto
    const label = await this.labelService.updateProjectLabel(labelId, userId, dto)

    res.status(200).json(label)
  }

  deleteProjectLabel = async (req: Request, res: Response) => {
    const { id: userId } = requireUser(req)
    const { labelId } = req.validated!.params as LabelParamsDto
    await this.labelService.deleteProjectLabel(labelId, userId)

    res.status(204).send()
  }
}
