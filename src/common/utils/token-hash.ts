import { createHash, timingSafeEqual } from "node:crypto"

export const hashToken = (token: string) => {
  return createHash("sha256").update(token).digest("hex")
}

export const compareTokens = (token: string, storedHash: string) => {
  const a = Buffer.from(hashToken(token), "hex")
  const b = Buffer.from(storedHash, "hex")

  if (a.length !== b.length) return false

  return timingSafeEqual(a, b)
}
