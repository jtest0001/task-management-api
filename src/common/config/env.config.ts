import { envSchema } from "./env.schema"

const loadConfig = () => {
  const env = envSchema.parse(process.env)

  return Object.freeze({
    server: {
      port: env.PORT,
      nodeEnv: env.NODE_ENV
    },
    database: {
      url: env.DATABASE_URL
    },
    jwt: {
      accessSecret: env.JWT_ACCESS_SECRET,
      refreshSecret: env.JWT_REFRESH_SECRET,
      refreshCookieName: env.REFRESH_TOKEN_COOKIE_NAME
    },
    client: {
      url: env.FRONT_END_URL
    },
    redis: {
      url: env.REDIS_URL
    }
  })
}

export const config = loadConfig()
export type Config = typeof config
