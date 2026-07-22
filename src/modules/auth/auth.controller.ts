import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./validators/register.schema"
import { LoginDto } from "./validators/login.schema"
import { UnauthorizedError } from "../../common/errors"

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  me = async (req: Request, res: Response) => {
    const userId = req.user?.id

    if (!userId) throw new UnauthorizedError()
    const user = await this.authService.me(userId)

    res.status(200).json(user)
  }

  register = async (req: Request, res: Response) => {
    const dto = req.body as RegisterDto
    const user = await this.authService.register(dto)

    res.status(201).json(user)
  }

  login = async (req: Request, res: Response) => {
    const dto = req.body as LoginDto
    const data = await this.authService.login(dto)

    res.status(200).json(data)
  }

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    if (!refreshToken) throw new UnauthorizedError()
    const data = await this.authService.refresh(refreshToken)

    res.status(200).json(data)
  }
}
