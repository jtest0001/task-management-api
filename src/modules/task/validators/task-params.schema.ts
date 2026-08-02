import { z } from "zod"

// TODO: make this schema validator common
export const TaskParamsSchema = z.object({
  taskId: z.uuid()
})

export type TaskParamsDto = z.infer<typeof TaskParamsSchema>
