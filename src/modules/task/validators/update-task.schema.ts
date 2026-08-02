import { z } from "zod"
import { CreateTaskSchema } from "./create-task.schema"

export const UpdateTaskSchema = CreateTaskSchema.partial().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: "At least one field must be provided" }
)

export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>
