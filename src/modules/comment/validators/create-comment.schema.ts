import { z } from "zod"

export const CreateCommentSchema = z.object({
  content: z.string().trim().min(1).max(5000)
})

export type CreateCommentDto = z.infer<typeof CreateCommentSchema>
