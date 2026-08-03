import { z } from "zod"
import { createUuidParamsSchema } from "../../../common/utils/validators"

export const TaskParamsSchema = createUuidParamsSchema("taskId")

export type TaskParamsDto = z.infer<typeof TaskParamsSchema>
