import { Request, Response } from "express"
import { config } from "../../common/config/env.config"
import { refreshTokenCookieOptions } from "../../common/config/cookie.config"
import { UnauthorizedError } from "../../common/errors"
import { AuthService } from "./auth.service"
import { LoginDto } from "./validators/login.schema"
import { RegisterDto } from "./validators/register.schema"
import { requireUser } from "../../common/utils/require-user"

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  me = async (req: Request, res: Response) => {
    const { id: userId } = requireUser(req)
    const user = await this.authService.me(userId)

    res.status(200).json(user)
  }

  register = async (req: Request, res: Response) => {
    const dto = req.validated!.body as RegisterDto
    const user = await this.authService.register(dto)

    res.status(201).json(user)
  }

  login = async (req: Request, res: Response) => {
    const dto = req.validated!.body as LoginDto
    const data = await this.authService.login(dto)
    res.cookie(config.jwt.refreshCookieName, data.refreshToken, refreshTokenCookieOptions)
    res.status(200).json({
      user: data.user,
      accessToken: data.accessToken
    })
  }

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies[config.jwt.refreshCookieName]

    if (!refreshToken) throw new UnauthorizedError()
    const data = await this.authService.refresh(refreshToken)
    res.cookie(config.jwt.refreshCookieName, data.refreshToken, refreshTokenCookieOptions)
    res.status(200).json({
      accessToken: data.accessToken
    })
  }

  logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies[config.jwt.refreshCookieName]
    await this.authService.logout(refreshToken)

    res.clearCookie(config.jwt.refreshCookieName, refreshTokenCookieOptions)
    res.status(204).json()
  }

  logoutAll = async (req: Request, res: Response) => {
    const refreshToken = req.cookies[config.jwt.refreshCookieName]
    await this.authService.logoutAll(refreshToken)

    res.clearCookie(config.jwt.refreshCookieName, refreshTokenCookieOptions)
    res.status(204).json()
  }
}
