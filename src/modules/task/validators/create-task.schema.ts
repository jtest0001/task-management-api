import { z } from "zod"

export const CreateTaskSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(1000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  assigneeId: z.uuid().optional(),
  dueDate: z.iso.datetime().optional()
})

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>
