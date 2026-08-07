import { z } from "zod"
import { CreateLabelSchema } from "./create-label.schema"

export const UpdateLabelSchema = CreateLabelSchema.partial().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: "At least one field must be provided" }
)

export type UpdateLabelDto = z.infer<typeof UpdateLabelSchema>
