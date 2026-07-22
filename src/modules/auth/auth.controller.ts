import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./validators/register.schema"
import { LoginDto } from "./validators/login.schema"

export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
