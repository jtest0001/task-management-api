import { randomUUID } from "node:crypto"
import { ConflictError } from "../../common/errors"
import { UnauthorizedError } from "../../common/errors"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../common/utils/jwt"
import { comparePasswords, hashPassword } from "../../common/utils/password"
import { AuthRepository } from "./auth.repository"
import { LoginDto } from "./validators/login.schema"
import { RegisterDto } from "./validators/register.schema"
import { SessionRepository } from "./session.repository"
import { access } from "node:fs"

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionRepository: SessionRepository
  ) {}

  me = async (userId: string) => {
    const user = await this.authRepository.findById(userId)

    if (!user) throw new UnauthorizedError()

    return {
      id: user.id,
      email: user.email
    }
  }

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
    await this.sessionRepository.createSession({
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

  refresh = async (token: string) => {
    // Check if valid token
    const tokenPayload = verifyRefreshToken(token)
    if (!tokenPayload) throw new UnauthorizedError()

    // Generate new tokens
    const { sub, sid } = tokenPayload
    const accessToken = generateAccessToken(sub)
    const refreshToken = generateRefreshToken({
      sub,
      sid
    })
    const hashedRefreshToken = await hashPassword(refreshToken)

    // Update session
    await this.sessionRepository.updateSession({
      id: sid,
      hashedRefreshToken,
      userId: sub,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })

    return {
      accessToken,
      refreshToken
    }
  }
}
