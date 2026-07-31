import { Prisma } from "@prisma/client"
import { SeedUsers } from "./users.seed"

export async function createProjects(db: Prisma.TransactionClient, users: SeedUsers) {
  const taskManagementApi = await db.project.upsert({
    where: {
      name_ownerId: {
        name: "Task Management API",
        ownerId: users.alice.id
      }
    },
    update: {},
    create: {
      name: "Task Management API",
      description: "Internal project for developing the company's task management backend.",
      ownerId: users.alice.id
    }
  })

  const marketingWebsite = await db.project.upsert({
    where: {
      name_ownerId: {
        name: "Marketing Website",
        ownerId: users.alice.id
      }
    },
    update: {},
    create: {
      name: "Marketing Website",
      description: "Corporate website redesign for the marketing department.",
      ownerId: users.alice.id
    }
  })

  const mobileBanking = await db.project.upsert({
    where: {
      name_ownerId: {
        name: "Mobile Banking Platform",
        ownerId: users.bob.id
      }
    },
    update: {},
    create: {
      name: "Mobile Banking Platform",
      description: "Customer-facing mobile banking application.",
      ownerId: users.bob.id
    }
  })

  const customerPortal = await db.project.upsert({
    where: {
      name_ownerId: {
        name: "Customer Portal",
        ownerId: users.charlie.id
      }
    },
    update: {},
    create: {
      name: "Customer Portal",
      description: "Self-service portal for customer account management.",
      ownerId: users.charlie.id
    }
  })

  const legacyCrm = await db.project.upsert({
    where: {
      name_ownerId: {
        name: "Legacy CRM",
        ownerId: users.alice.id
      }
    },
    update: {},
    create: {
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
