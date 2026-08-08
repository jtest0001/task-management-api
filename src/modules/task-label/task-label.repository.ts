import { DbClient } from "../../types/prisma.types"

export class TaskLabelRepository {
  constructor(private readonly db: DbClient) {}

  findByTaskIdAndLabelId = (taskId: string, labelId: string) => {
    return this.db.taskLabel.findUnique({
      where: {
        taskId_labelId: {
          taskId,
          labelId
        }
      }
    })
  }

  create = (taskId: string, labelId: string) => {
    return this.db.taskLabel.create({
      data: {
        taskId,
        labelId
      }
    })
  }

  delete = (taskId: string, labelId: string) => {
    return this.db.taskLabel.deleteMany({
      where: {
        taskId,
        labelId
      }
    })
  }
}
