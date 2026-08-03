import { z } from "zod"

export const createUuidParamsSchema = <TKey extends string>(key: TKey) =>
  z.object({
    [key]: z.uuid()
  } as Record<TKey, z.ZodUUID>)
