import { z } from "zod"

export const RegisterSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(72)
})

export type RegisterDto = z.infer<typeof RegisterSchema>
