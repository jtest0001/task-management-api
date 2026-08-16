import { AppError } from "./app.error"

export class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429)
  }
}
