import { Request, Response } from "express"
import jwt from "jsonwebtoken"

export const verifyToken = (token: string) => {
  const id = jwt.verify(token, "heyiamsecret") as any
  return id
}

export const authenticate = (req: Request, res: Response, next: any) => {
  const { token } = req.headers
  if (typeof token === "string") {
    try {
      const id = verifyToken(token)
      req.user = {
        email: "",
        id,
      }
      next()
    } catch (err) {
      res.sendError(401, "invalid token")
    }
  } else {
    res.sendError(401, "token is required")
  }
}
