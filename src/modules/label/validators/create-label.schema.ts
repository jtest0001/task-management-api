import { z } from "zod"

export const CreateLabelSchema = z.object({
  name: z.string().trim().min(1).max(255),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color")
})

export type CreateLabelDto = z.infer<typeof CreateLabelSchema>
