import { z } from "zod"

export const UpdateMemberRoleParamsSchema = z.object({
  projectId: z.uuid(),
  memberId: z.uuid()
})

export type UpdateMemberRoleParamsDto = z.infer<typeof UpdateMemberRoleParamsSchema>
