import { z } from "zod"
import { CreateProjectSchema } from "./create-project.schema"

export const UpdateProjectSchema = CreateProjectSchema.partial().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: "At least one field must be provided" }
)

export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>
