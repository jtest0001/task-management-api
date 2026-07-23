import { PrismaClient } from "@prisma/client"
import { RegisterDto } from "./validators/register.schema"
import { ConflictError } from "../../common/errors"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export class AuthRepository {
  constructor(private readonly db: PrismaClient) {}
  findById = (id: string) => {
    return this.db.user.findUnique({ where: { id } })
  }

  findByEmail = (email: string) => {
    return this.db.user.findUnique({ where: { email } })
  }

  createUser = async (data: RegisterDto) => {
    try {
      const user = await this.db.user.create({
        data,
        select: {
          id: true,
          email: true
        }
      })

      return user
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictError("User already exists")
      }

      throw error
    }
  }
}
