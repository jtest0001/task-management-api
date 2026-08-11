import { z } from "zod"
import { config } from "../../../common/config/env.config"

export const RefreshSchema = z.object({
  [config.jwt.refreshCookieName]: z.string().trim().min(1, "Refresh token is required")
})

export type RefreshDto = z.infer<typeof RefreshSchema>
