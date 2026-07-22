import { randomUUID } from "node:crypto"
import { ConflictError } from "../../common/errors"
import { UnauthorizedError } from "../../common/errors"
import { generateAccessToken, generateRefreshToken } from "../../common/utils/jwt"
import { comparePasswords, hashPassword } from "../../common/utils/password"
import { AuthRepository } from "./auth.repository"
import { LoginDto } from "./validators/login.schema"
import { RegisterDto } from "./validators/register.schema"
import { SessionRepository } from "./session.repository"

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionRepository: SessionRepository
  ) {}

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

    // Create refresh token
    const sessionId = randomUUID()
    const refreshToken = generateRefreshToken({
      sub: existingUser.id,
      sid: sessionId
    })

    // Create session
    const hashedRefreshToken = await hashPassword(refreshToken)
    await this.sessionRepository.create({
      id: sessionId,
      hashedRefreshToken,
      userId: existingUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })

    return {
      user: {
        id: existingUser.id,
        email: existingUser.email
      },
      accessToken,
      refreshToken
    }
  }
}
