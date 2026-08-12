import { DbClient } from "../../types/prisma.types"
import { CreateLabelData, UpdateLabelData } from "./label.types"

export class LabelRepository {
  constructor(private readonly db: DbClient) {}

  findById = (labelId: string) => {
    return this.db.label.findUnique({
      where: {
        id: labelId,
        project: {
          deletedAt: null
        }
      }
    })
  }

  findByProjectId = (projectId: string) => {
    return this.db.label.findMany({
      where: {
        projectId,
        project: {
          deletedAt: null
        }
      },
      orderBy: {
        name: "asc"
      }
    })
  }

  findByTaskId = (taskId: string) => {
    return this.db.label.findMany({
      where: {
        tasks: {
          some: { taskId }
        }
      },
      orderBy: {
        name: "asc"
      }
    })
  }

  create = (data: CreateLabelData) => {
    return this.db.label.create({ data })
  }

  update = (labelId: string, data: UpdateLabelData) => {
    return this.db.label.update({
      where: { id: labelId },
      data
    })
  }

  delete = (labelId: string) => {
    return this.db.label.delete({
      where: { id: labelId }
    })
  }
}
