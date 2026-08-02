import { PrismaClient } from "@prisma/client"

interface SessionData {
  id: string
  hashedRefreshToken: string
  userId: string
  expiresAt: Date
}

export class SessionRepository {
  constructor(private readonly db: PrismaClient) {}

  findById = async (id: string) => {
    return this.db.session.findUnique({ where: { id } })
  }

  createSession = async (data: SessionData) => {
    return this.db.session.create({ data })
  }

  updateSession = async (data: SessionData) => {
    return this.db.session.update({ where: { id: data.id }, data })
  }

  deleteBySessionId = async (sessionId: string) => {
    return this.db.session.delete({ where: { id: sessionId } })
  }

  deleteByUserId = async (userId: string) => {
    return this.db.session.deleteMany({ where: { userId } })
  }
}
