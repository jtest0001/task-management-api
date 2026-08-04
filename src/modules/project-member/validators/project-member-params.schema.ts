import { z } from "zod"

export const ProjectMemberParamsSchema = z.object({
  projectId: z.uuid(),
  memberId: z.uuid()
})

export type ProjectMemberParamsDto = z.infer<typeof ProjectMemberParamsSchema>
