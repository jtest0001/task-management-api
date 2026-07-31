import { Prisma } from "@prisma/client"
import { SeedUsers } from "./users.seed"
import { SeedTasks } from "./tasks.seed"

export async function createComments(db: Prisma.TransactionClient, users: SeedUsers, tasks: SeedTasks) {
  return await db.comment.createMany({
    data: [
      {
        content: "Let's make sure refresh token rotation follows our security guidelines.",
        authorId: users.alice.id,
        taskId: tasks.jwtAuth.id
      },
      {
        content: "I've finished the JWT utility. Starting integration with the auth service.",
        authorId: users.bob.id,
        taskId: tasks.jwtAuth.id
      },
      {
        content: "Looks good. Please add unit tests before merging.",
        authorId: users.alice.id,
        taskId: tasks.jwtAuth.id
      },

      {
        content: "I found the issue. The previous refresh token wasn't invalidated after rotation.",
        authorId: users.charlie.id,
        taskId: tasks.refreshBug.id
      },
      {
        content: "Fixed locally. I'll open a PR shortly.",
        authorId: users.bob.id,
        taskId: tasks.refreshBug.id
      },

      {
        content: "Added request and response examples for every authentication endpoint.",
        authorId: users.diana.id,
        taskId: tasks.apiDocs.id
      },

      {
        content: "Waiting for final mockups from the design team.",
        authorId: users.alice.id,
        taskId: tasks.loginScreen.id
      },

      {
        content: "Temporary debugging note.",
        authorId: users.alice.id,
        taskId: tasks.refreshBug.id,
        deletedAt: new Date("2026-01-15")
      }
    ],
    skipDuplicates: false
  })
}

export type CommentSeed = Awaited<ReturnType<typeof createComments>>
