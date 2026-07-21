import bcrypt from "bcrypt"

const SALT_ROUNDS = 12

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
}
