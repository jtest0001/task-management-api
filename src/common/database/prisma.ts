import { PrismaClient } from "@prisma/client"
import { config } from "../config/config"
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (config.server.nodeEnv !== "production") globalForPrisma.prisma = prisma
