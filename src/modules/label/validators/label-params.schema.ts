import { z } from "zod"
import { createUuidParamsSchema } from "../../../common/utils/validators"

export const LabelParamsSchema = createUuidParamsSchema("labelId")
export type LabelParamsDto = z.infer<typeof LabelParamsSchema>
