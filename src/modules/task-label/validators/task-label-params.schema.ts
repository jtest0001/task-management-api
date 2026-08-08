import { z } from "zod"

export const TaskLabelParamsSchema = z.object({
  taskId: z.uuid(),
  labelId: z.uuid()
})

export type TaskLabelParamsDto = z.infer<typeof TaskLabelParamsSchema>
