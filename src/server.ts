import "dotenv/config"
import { createApp } from "./app"
import { config } from "./common/config/env.config"
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
      logger.info({ port: config.server.port }, "Server started")
    })

    // Register graceful shutdown
    const shutdown = (signal: string) => {
      logger.info({ signal }, "Received shutdown signal")

      server.close(() => {
        prisma
          .$disconnect()
          .then(() => {
            logger.info("Disconnected from database")
            process.exit(0)
          })
          .catch((err) => {
            logger.error(err, "Failed to disconnect Prisma")
            process.exit(1)
          })
      })
    }

    process.on("SIGTERM", () => shutdown("SIGTERM"))
    process.on("SIGINT", () => shutdown("SIGINT"))
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

bootstrap()
