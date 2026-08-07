import { z } from "zod"

export const AddMemberSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email())
})

export type AddMemberDto = z.infer<typeof AddMemberSchema>
