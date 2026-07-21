import { hashPassword } from "../../common/utils/password"
import { AuthRepository } from "./auth.repository"
import { RegisterDto } from "./validators/register.schema"

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  register = async (dto: RegisterDto) => {
    // Check if existing user
    const existingUser = await this.authRepository.findByEmail(dto.email)
    if (existingUser) throw new Error("Existing user")

    // Hash password
    const hashedPassword = await hashPassword(dto.password)

    // Register user
    const user = await this.authRepository.createUser({
      email: dto.email,
      password: hashedPassword
    })

    return user
  }
}
