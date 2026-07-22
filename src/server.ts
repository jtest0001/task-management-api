import "dotenv/config"
import { createApp } from "./app"
import { config } from "./common/config"
import { logger } from "./common/logger"
import { prisma } from "./common/database/prisma"

async function bootstrap() {
  try {
    // Connect to DB
    await prisma.$connect()

    // Build express app
    const app = createApp()

    // Start HTTP server
    const server = app.listen(config.server.port, () => {
      logger.info(`Server running on port ${config.server.port}`)
    })

    // Register graceful shutdown
    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received")

      server.close(async () => {
        await prisma.$disconnect()
        process.exit(0)
      })
    })
    process.on("SIGINT", async () => {
      logger.info("SIGINT received")

      server.close(async () => {
        await prisma.$disconnect()
        process.exit(0)
      })
    })
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

bootstrap()
