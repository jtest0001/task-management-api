import { PrismaClient } from "@prisma/client"

interface SessionData {
  id: string
  hashedRefreshToken: string
  userId: string
  expiresAt: Date
}

export class SessionRepository {
  constructor(private readonly db: PrismaClient) {}

  create = async (data: SessionData) => {
    return this.db.session.create({ data })
  }
}
