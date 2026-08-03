import { z } from "zod"

export const CommentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
})

export type CommentQueryDto = z.infer<typeof CommentQuerySchema>
