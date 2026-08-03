import { z } from "zod"

export const CommentContentSchema = z.object({
  content: z.string().trim().min(1).max(5000)
})

export type CommentContentDto = z.infer<typeof CommentContentSchema>
