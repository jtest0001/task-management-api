import { z } from "zod"
import { createUuidParamsSchema } from "../../../common/utils/validators"

export const ProjectParamsSchema = createUuidParamsSchema("projectId")
export type ProjectParamsDto = z.infer<typeof ProjectParamsSchema>
