import { Prisma, PrismaClient } from "@prisma/client"
import { createUsers } from "./users.seed"
import { createProjects } from "./projects.seed"
import { createProjectMembers } from "./project-members.seed"
import { createLabels } from "./labels.seed"
import { createTasks } from "./tasks.seed"
import { createComments } from "./comments.seed"
import { createTaskLabels } from "./task-labels.seed"

const prisma = new PrismaClient()

async function clearDatabase(db: Prisma.TransactionClient) {
  await db.taskLabel.deleteMany()
  await db.comment.deleteMany()
  await db.task.deleteMany()
  await db.label.deleteMany()
  await db.projectMember.deleteMany()
  await db.project.deleteMany()
  await db.session.deleteMany()
  await db.user.deleteMany()
}

async function main() {
  await prisma.$transaction(async (tx) => {
    await clearDatabase(tx)
    console.log("Initialized DB")

    const users = await createUsers(tx)

    console.log("Seeded users:")
    console.log(Object.values(users).map((u) => ({ id: u.id, email: u.email })))

    const projects = await createProjects(tx, users)

    console.log("Seeded projects:")
    console.log(projects)

    const projectMembers = await createProjectMembers(tx, users, projects)

    console.log("Seeded project members:")
    console.log(projectMembers)

    const labels = await createLabels(tx, projects)

    console.log("Seeded labels:")
    console.log(labels)

    const tasks = await createTasks(tx, users, projects)

    console.log("Seeded tasks:")
    console.log(tasks)

    const comments = await createComments(tx, users, tasks)

    console.log("Seeded comments:")
    console.log(comments)

    const taskLabels = await createTaskLabels(tx, tasks, labels)

    console.log("Seeded task labels:")
    console.log(taskLabels)
  })
}

main()
  .then(() => {
    console.log("🌱 Database seeded")
  })
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
