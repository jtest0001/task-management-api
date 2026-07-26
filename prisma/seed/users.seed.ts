import { Prisma } from "@prisma/client"
import { hashPassword } from "../../src/common/utils/password"

export async function createUsers(db: Prisma.TransactionClient) {
  const passwordHash = await hashPassword("Password123!")

  const alice = await db.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      password: passwordHash
    }
  })

  const bob = await db.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      password: passwordHash
    }
  })

  const charlie = await db.user.upsert({
    where: { email: "charlie@example.com" },
    update: {},
    create: {
      email: "charlie@example.com",
      password: passwordHash
    }
  })

  const diana = await db.user.upsert({
    where: { email: "diana@example.com" },
    update: {},
    create: {
      email: "diana@example.com",
      password: passwordHash
    }
  })

  const ethan = await db.user.upsert({
    where: { email: "ethan@example.com" },
    update: {},
    create: {
      email: "ethan@example.com",
      password: passwordHash
    }
  })

  return {
    alice,
    bob,
    charlie,
    diana,
    ethan
  }
}

export type SeedUsers = Awaited<ReturnType<typeof createUsers>>
