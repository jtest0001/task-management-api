import cors from "cors"
import { config } from "./env.config"

export const corsConfig = cors({
  origin: config.client.url,
  credentials: true
})
