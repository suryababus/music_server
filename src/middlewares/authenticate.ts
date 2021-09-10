import { Request, Response } from "express"
import jwt from "jsonwebtoken"

export const authenticate = (req: Request, res: Response, next: any) => {
  const { token } = req.headers
  if (token) {
    try {
      const id = jwt.verify(token as string, "heyiamsecret") as any
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
