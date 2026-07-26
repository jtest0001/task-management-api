import { Prisma } from "@prisma/client"
import { SeedTasks } from "./tasks.seed"
import { SeedLabels } from "./labels.seed"

export async function createTaskLabels(db: Prisma.TransactionClient, tasks: SeedTasks, labels: SeedLabels) {
  await db.taskLabel.createMany({
    data: [
      // Task Management API
      {
        taskId: tasks.jwtAuth.id,
        labelId: labels.backend.id
      },
      {
        taskId: tasks.jwtAuth.id,
        labelId: labels.feature.id
      },

      {
        taskId: tasks.refreshBug.id,
        labelId: labels.backend.id
      },
      {
        taskId: tasks.refreshBug.id,
        labelId: labels.bug.id
      },

      {
        taskId: tasks.apiDocs.id,
        labelId: labels.documentation.id
      },

      {
        taskId: tasks.loginScreen.id,
        labelId: labels.frontend.id
      },
      {
        taskId: tasks.loginScreen.id,
        labelId: labels.feature.id
      },

      // Marketing Website
      {
        taskId: tasks.landingPage.id,
        labelId: labels.design.id
      },
      {
        taskId: tasks.landingPage.id,
        labelId: labels.content.id
      },

      {
        taskId: tasks.seoMetadata.id,
        labelId: labels.seo.id
      },
      {
        taskId: tasks.seoMetadata.id,
        labelId: labels.content.id
      },

      // Mobile Banking
      {
        taskId: tasks.biometricLogin.id,
        labelId: labels.security.id
      },

      {
        taskId: tasks.paymentApi.id,
        labelId: labels.payments.id
      },

      {
        taskId: tasks.transactionTimeout.id,
        labelId: labels.security.id
      },
      {
        taskId: tasks.transactionTimeout.id,
        labelId: labels.payments.id
      },

      // Customer Portal
      {
        taskId: tasks.initialSetup.id,
        labelId: labels.enhancement.id
      }
    ],
    skipDuplicates: true
  })
}
