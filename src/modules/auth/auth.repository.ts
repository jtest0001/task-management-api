import { PrismaClient } from "@prisma/client"
import { ConflictError } from "../../common/errors"

interface CreateUserData {
  email: string
  password: string
}

export class AuthRepository {
  constructor(private readonly db: PrismaClient) {}

  findById = (id: string) => {
    return this.db.user.findUnique({ where: { id } })
  }

  findByEmail = (email: string) => {
    return this.db.user.findUnique({ where: { email } })
  }

  createUser = async (data: CreateUserData) => {
    return this.db.user.create({
      data,
      select: {
        id: true,
        email: true
      }
    })
  }
}
