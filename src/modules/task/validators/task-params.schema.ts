import { z } from "zod"

export const TaskParamsSchema = z.object({
  taskId: z.uuid()
})

export type TaskParamsDto = z.infer<typeof TaskParamsSchema>
