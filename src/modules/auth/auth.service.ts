import { ConflictError } from "../../common/errors"
import { UnauthorizedError } from "../../common/errors/unauthorized.error"
import { generateAccessToken } from "../../common/utils/jwt"
import { comparePasswords, hashPassword } from "../../common/utils/password"
import { AuthRepository } from "./auth.repository"
import { LoginDto } from "./validators/login.schema"
import { RegisterDto } from "./validators/register.schema"

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  register = async (dto: RegisterDto) => {
    // Check if existing user
    const existingUser = await this.authRepository.findByEmail(dto.email)
    if (existingUser) throw new ConflictError("Email already registered")

    // Hash password
    const hashedPassword = await hashPassword(dto.password)

    // Register user
    const user = await this.authRepository.createUser({
      email: dto.email,
      password: hashedPassword
    })

    return user
  }

  login = async (dto: LoginDto) => {
    // Check if email is existing
    const existingUser = await this.authRepository.findByEmail(dto.email)
    if (!existingUser) throw new UnauthorizedError()

    // Check if password is valid
    const isValidPassword = await comparePasswords(dto.password, existingUser.password)
    if (!isValidPassword) throw new UnauthorizedError()

    // Create access token
    const accessToken = generateAccessToken(existingUser.id)

    return {
      user: {
        id: existingUser.id,
        email: existingUser.email
      },
      accessToken
    }
  }
}
