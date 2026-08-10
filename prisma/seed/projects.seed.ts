import { Prisma } from "@prisma/client"
import { SeedUsers } from "./users.seed"

// `(name, ownerId)` is no longer a Prisma-level compound unique (it is a partial index on
// active rows), so it cannot be used as an upsert selector. The seed clears the database
// first, so a plain create is both sufficient and simpler.
export async function createProjects(db: Prisma.TransactionClient, users: SeedUsers) {
  const taskManagementApi = await db.project.create({
    data: {
      name: "Task Management API",
      description: "Internal project for developing the company's task management backend.",
      ownerId: users.alice.id
    }
  })

  const marketingWebsite = await db.project.create({
    data: {
      name: "Marketing Website",
      description: "Corporate website redesign for the marketing department.",
      ownerId: users.alice.id
    }
  })

  const mobileBanking = await db.project.create({
    data: {
      name: "Mobile Banking Platform",
      description: "Customer-facing mobile banking application.",
      ownerId: users.bob.id
    }
  })

  const customerPortal = await db.project.create({
    data: {
      name: "Customer Portal",
      description: "Self-service portal for customer account management.",
      ownerId: users.charlie.id
    }
  })

  const legacyCrm = await db.project.create({
    data: {
      name: "Legacy CRM",
      description: "Deprecated CRM system kept for historical reference.",
      ownerId: users.alice.id,
      deletedAt: new Date("2026-01-15T10:00:00Z")
    }
  })

  return {
    taskManagementApi,
    marketingWebsite,
    mobileBanking,
    customerPortal,
    legacyCrm
  }
}

export type SeedProjects = Awaited<ReturnType<typeof createProjects>>
