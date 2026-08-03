import { z } from "zod"
import { createUuidParamsSchema } from "../../../common/utils/validators"

export const CommentParamsSchema = createUuidParamsSchema("commentId")

export type CommentParamsDto = z.infer<typeof CommentParamsSchema>
