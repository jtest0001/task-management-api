import { z } from "zod"

export const ProjectParamsSchema = z.object({
  projectId: z.uuid()
})

export type ProjectParamsDto = z.infer<typeof ProjectParamsSchema>
