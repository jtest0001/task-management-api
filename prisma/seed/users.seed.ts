import { Prisma } from "@prisma/client"
import { hashPassword } from "../../src/common/utils/password"

// `email` is no longer a Prisma-level unique field (it is a partial index on active rows),
// so it cannot be used as an upsert selector. The seed clears the database first, so a plain
// create is both sufficient and simpler.
export async function createUsers(db: Prisma.TransactionClient) {
  const passwordHash = await hashPassword("Password123!")

  const createUser = (email: string) =>
    db.user.create({
      data: {
        email,
        password: passwordHash
      }
    })

  const alice = await createUser("alice@example.com")
  const bob = await createUser("bob@example.com")
  const charlie = await createUser("charlie@example.com")
  const diana = await createUser("diana@example.com")
  const ethan = await createUser("ethan@example.com")

  return {
    alice,
    bob,
    charlie,
    diana,
    ethan
  }
}

export type SeedUsers = Awaited<ReturnType<typeof createUsers>>
