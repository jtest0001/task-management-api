import { z } from "zod"

export const AddMemberSchema = z.object({
  email: z.email().trim().toLowerCase()
})

export type AddMemberDto = z.infer<typeof AddMemberSchema>
