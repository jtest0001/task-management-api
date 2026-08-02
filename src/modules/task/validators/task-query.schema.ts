import { TaskPriority, TaskStatus } from "@prisma/client"
import { z } from "zod"

export const TaskSortBySchema = z.enum(["createdAt", "dueDate", "priority", "title"])
export const SortOrderSchema = z.enum(["asc", "desc"])

export const TaskQuerySchema = z.object({
  status: z.enum(TaskStatus).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  priority: z.enum(TaskPriority).optional(),
  assigneeId: z.uuid().optional(),
  search: z.preprocess((value) => {
    if (typeof value !== "string") {
      return value
    }

    const trimmed = value.trim()

    return trimmed === "" ? undefined : trimmed
  }, z.string().max(255).optional()),
  sortBy: TaskSortBySchema.default("createdAt"),
  sortOrder: SortOrderSchema.default("desc")
})

export type TaskQueryDto = z.infer<typeof TaskQuerySchema>
