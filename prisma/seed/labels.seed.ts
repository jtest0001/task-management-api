import { Prisma } from "@prisma/client"
import { SeedProjects } from "./projects.seed"

export async function createLabels(db: Prisma.TransactionClient, projects: SeedProjects) {
  // Task Management API
  const bug = await db.label.upsert({
    where: {
      projectId_name: {
        projectId: projects.taskManagementApi.id,
        name: "Bug"
      }
    },
    update: {},
    create: {
      name: "Bug",
      color: "#EF4444",
      projectId: projects.taskManagementApi.id
    }
  })

  const feature = await db.label.upsert({
    where: {
      projectId_name: {
        projectId: projects.taskManagementApi.id,
        name: "Feature"
      }
    },
    update: {},
    create: {
      name: "Feature",
      color: "#3B82F6",
      projectId: projects.taskManagementApi.id
    }
  })

  const backend = await db.label.upsert({
    where: {
      projectId_name: {
        projectId: projects.taskManagementApi.id,
        name: "Backend"
      }
    },
    update: {},
    create: {
      name: "Backend",
      color: "#8B5CF6",
      projectId: projects.taskManagementApi.id
    }
  })

  const frontend = await db.label.upsert({
    where: {
      projectId_name: {
        projectId: projects.taskManagementApi.id,
        name: "Frontend"
      }
    },
    update: {},
    create: {
      name: "Frontend",
      color: "#10B981",
      projectId: projects.taskManagementApi.id
    }
  })

  const documentation = await db.label.upsert({
    where: {
      projectId_name: {
        projectId: projects.taskManagementApi.id,
        name: "Documentation"
      }
    },
    update: {},
    create: {
      name: "Documentation",
      color: "#F59E0B",
      projectId: projects.taskManagementApi.id
    }
  })

  // Marketing Website
  const design = await db.label.upsert({
    where: {
      projectId_name: {
        projectId: projects.marketingWebsite.id,
        name: "Design"
      }
    },
    update: {},
    create: {
      name: "Design",
      color: "#EC4899",
      projectId: projects.marketingWebsite.id
    }
  })

  const content = await db.label.upsert({
    where: {
      projectId_name: {
        projectId: projects.marketingWebsite.id,
        name: "Content"
      }
    },
    update: {},
    create: {
      name: "Content",
      color: "#06B6D4",
      projectId: projects.marketingWebsite.id
    }
  })

  const seo = await db.label.upsert({
    where: {
      projectId_name: {
        projectId: projects.marketingWebsite.id,
        name: "SEO"
      }
    },
    update: {},
    create: {
      name: "SEO",
      color: "#84CC16",
      projectId: projects.marketingWebsite.id
    }
  })

  // Mobile Banking Platform
  const security = await db.label.upsert({
    where: {
      projectId_name: {
        projectId: projects.mobileBanking.id,
        name: "Security"
      }
    },
    update: {},
    create: {
      name: "Security",
      color: "#DC2626",
      projectId: projects.mobileBanking.id
    }
  })

  const payments = await db.label.upsert({
    where: {
      projectId_name: {
        projectId: projects.mobileBanking.id,
        name: "Payments"
      }
    },
    update: {},
    create: {
      name: "Payments",
      color: "#2563EB",
      projectId: projects.mobileBanking.id
    }
  })

  const kyc = await db.label.upsert({
    where: {
      projectId_name: {
        projectId: projects.mobileBanking.id,
        name: "KYC"
      }
    },
    update: {},
    create: {
      name: "KYC",
      color: "#9333EA",
      projectId: projects.mobileBanking.id
    }
  })

  // Customer Portal
  const enhancement = await db.label.upsert({
    where: {
      projectId_name: {
        projectId: projects.customerPortal.id,
        name: "Enhancement"
      }
    },
    update: {},
    create: {
      name: "Enhancement",
      color: "#14B8A6",
      projectId: projects.customerPortal.id
    }
  })

  return {
    bug,
    feature,
    backend,
    frontend,
    documentation,
    design,
    content,
    seo,
    security,
    payments,
    kyc,
    enhancement
  }
}

export type SeedLabels = Awaited<ReturnType<typeof createLabels>>
