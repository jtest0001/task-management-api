import { z } from "zod"

export const UpdateProjectSchema = z.object({
  name: z.string().trim().min(1).max(72),
  description: z.string().trim().max(72).optional()
})

export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>
