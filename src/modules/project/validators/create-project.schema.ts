import { z } from "zod"

export const CreateProjectSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().max(5000).optional()
})

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>
