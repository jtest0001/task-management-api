import { Prisma } from "@prisma/client"
import { SeedProjects } from "./projects.seed"
import { SeedUsers } from "./users.seed"

export async function createProjectMembers(db: Prisma.TransactionClient, users: SeedUsers, projects: SeedProjects) {
  await db.projectMember.createMany({
    data: [
      // Task Management API
      {
        projectId: projects.taskManagementApi.id,
        userId: users.alice.id,
        role: "OWNER"
      },
      {
        projectId: projects.taskManagementApi.id,
        userId: users.bob.id,
        role: "ADMIN"
      },
      {
        projectId: projects.taskManagementApi.id,
        userId: users.charlie.id,
        role: "MEMBER"
      },
      {
        projectId: projects.taskManagementApi.id,
        userId: users.diana.id,
        role: "MEMBER"
      },

      // Marketing Website
      {
        projectId: projects.marketingWebsite.id,
        userId: users.alice.id,
        role: "OWNER"
      },
      {
        projectId: projects.marketingWebsite.id,
        userId: users.diana.id,
        role: "MEMBER"
      },

      // Mobile Banking Platform
      {
        projectId: projects.mobileBanking.id,
        userId: users.bob.id,
        role: "OWNER"
      },
      {
        projectId: projects.mobileBanking.id,
        userId: users.alice.id,
        role: "ADMIN"
      },
      {
        projectId: projects.mobileBanking.id,
        userId: users.charlie.id,
        role: "MEMBER"
      },

      // Customer Portal
      {
        projectId: projects.customerPortal.id,
        userId: users.charlie.id,
        role: "OWNER"
      },

      // Legacy CRM
      {
        projectId: projects.legacyCrm.id,
        userId: users.alice.id,
        role: "OWNER"
      }
    ],
    skipDuplicates: true
  })
}

export type SeedProjectMembers = Awaited<ReturnType<typeof createProjectMembers>>
