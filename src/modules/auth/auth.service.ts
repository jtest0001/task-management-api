import { randomUUID } from "node:crypto"
import { ConflictError, UnauthorizedError } from "../../common/errors"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../common/utils/jwt"
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

  refresh = async (refreshToken: string) => {
    // Check if session exists
    const { sub, sid } = verifyRefreshToken(refreshToken)
    const session = await this.sessionRepository.findById(sid)
    if (!session) throw new UnauthorizedError()

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      await this.sessionRepository.deleteBySessionId(session.id)
      throw new UnauthorizedError()
    }

    // Check if user exists
    const user = await this.authRepository.findById(sub)
    if (!user) {
      await this.sessionRepository.deleteBySessionId(session.id)
      throw new UnauthorizedError()
    }

    // Check if tokens match
    const isTokenValid = await comparePasswords(refreshToken, session.hashedRefreshToken)
    if (!isTokenValid) {
      await this.sessionRepository.deleteBySessionId(session.id)
      throw new UnauthorizedError()
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user.id)
    const newRefreshToken = generateRefreshToken({
      sub: user.id,
      sid
    })
    const hashedRefreshToken = await hashPassword(newRefreshToken)

    // Update session
    await this.sessionRepository.updateSession({
      id: sid,
      hashedRefreshToken,
      userId: sub,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })

    return {
      accessToken,
      refreshToken: newRefreshToken
    }
  }

  logout = async (refreshToken: string) => {
    try {
      const { sid } = verifyRefreshToken(refreshToken)
      await this.sessionRepository.deleteBySessionId(sid)
    } catch {}
  }

  logoutAll = async (refreshToken: string) => {
    try {
      const { sub } = verifyRefreshToken(refreshToken)
      await this.sessionRepository.deleteByUserId(sub)
    } catch {}
  }
}
