import { Prisma, TaskPriority, TaskStatus } from "@prisma/client"
import { SeedProjects } from "./projects.seed"
import { SeedUsers } from "./users.seed"

export async function createTasks(db: Prisma.TransactionClient, users: SeedUsers, projects: SeedProjects) {
  const jwtAuth = await db.task.create({
    data: {
      title: "Implement JWT Authentication",
      description: "Implement access and refresh token authentication.",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      projectId: projects.taskManagementApi.id,
      createdById: users.alice.id,
      assigneeId: users.bob.id,
      dueDate: new Date("2026-08-05")
    }
  })

  const refreshBug = await db.task.create({
    data: {
      title: "Fix Refresh Token Rotation Bug",
      description: "Ensure old refresh tokens are invalidated after rotation.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: projects.taskManagementApi.id,
      createdById: users.alice.id,
      assigneeId: users.charlie.id,
      dueDate: new Date("2026-08-02")
    }
  })

  const apiDocs = await db.task.create({
    data: {
      title: "Update API Documentation",
      description: "Document authentication and project endpoints.",
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      projectId: projects.taskManagementApi.id,
      createdById: users.bob.id,
      assigneeId: users.diana.id
    }
  })

  const loginScreen = await db.task.create({
    data: {
      title: "Design Login Screen",
      description: "Create responsive login page design.",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: projects.taskManagementApi.id,
      createdById: users.alice.id
    }
  })

  const legacyAuth = await db.task.create({
    data: {
      title: "Remove Legacy Authentication Flow",
      description: "Clean up deprecated authentication implementation.",
      status: TaskStatus.DONE,
      priority: TaskPriority.LOW,
      projectId: projects.taskManagementApi.id,
      createdById: users.alice.id,
      deletedAt: new Date("2026-01-15")
    }
  })

  const landingPage = await db.task.create({
    data: {
      title: "Create Landing Page",
      description: "Build the new marketing landing page.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      projectId: projects.marketingWebsite.id,
      createdById: users.alice.id,
      assigneeId: users.diana.id
    }
  })

  const seoMetadata = await db.task.create({
    data: {
      title: "Optimize SEO Metadata",
      description: "Improve metadata for search engine indexing.",
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      projectId: projects.marketingWebsite.id,
      createdById: users.alice.id
    }
  })

  const biometricLogin = await db.task.create({
    data: {
      title: "Implement Biometric Login",
      description: "Support Face ID and fingerprint authentication.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: projects.mobileBanking.id,
      createdById: users.bob.id,
      assigneeId: users.alice.id
    }
  })

  const paymentApi = await db.task.create({
    data: {
      title: "Review Payment API",
      description: "Review API contract before release.",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: projects.mobileBanking.id,
      createdById: users.bob.id,
      assigneeId: users.charlie.id
    }
  })

  const transactionTimeout = await db.task.create({
    data: {
      title: "Fix Transaction Timeout",
      description: "Investigate intermittent timeout during transfers.",
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      projectId: projects.mobileBanking.id,
      createdById: users.alice.id,
      assigneeId: users.bob.id
    }
  })

  const initialSetup = await db.task.create({
    data: {
      title: "Initial Project Setup",
      description: "Initialize repository and project structure.",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: projects.customerPortal.id,
      createdById: users.charlie.id
    }
  })

  return {
    jwtAuth,
    refreshBug,
    apiDocs,
    loginScreen,
    legacyAuth,
    landingPage,
    seoMetadata,
    biometricLogin,
    paymentApi,
    transactionTimeout,
    initialSetup
  }
}

export type SeedTasks = Awaited<ReturnType<typeof createTasks>>
