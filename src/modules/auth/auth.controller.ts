import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./validators/register.schema"

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const dto = req.body as RegisterDto
    const user = await this.authService.register(dto)

    res.status(201).json(user)
  }
}
