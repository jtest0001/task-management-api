import { z } from "zod"

export const CreateLabelSchema = z.object({
  name: z.string().trim().min(1).max(255),
  color: z.string().trim().min(1).max(7)
})

export type CreateLabelDto = z.infer<typeof CreateLabelSchema>
