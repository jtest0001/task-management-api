import { PrismaClient } from "@prisma/client"
import { RegisterDto } from "./validators/register.schema"

export class AuthRepository {
  constructor(private readonly db: PrismaClient) {}

  findByEmail = (email: string) => {
    return this.db.user.findUnique({ where: { email } })
  }

  createUser = (data: RegisterDto) => {
    return this.db.user.create({
      data,
      select: {
        id: true,
        email: true
      }
    })
  }
}
