import { z } from "zod"

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72)
})

export type LoginDto = z.infer<typeof LoginSchema>
