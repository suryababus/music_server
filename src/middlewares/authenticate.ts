import { Request, Response } from "express"
import jwt from "jsonwebtoken"

export const verifyToken = (token: string) => {
  const userDetails = jwt.verify(token, "heyiamsecret")
  return JSON.parse(JSON.stringify(userDetails))
}

export const authenticate = (req: Request, res: Response, next: any) => {
  const { token } = req.headers
  if (typeof token === "string") {
    try {
      const { id, displayName } = verifyToken(token)
      req.user = {
        email: "",
        id,
        displayName,
      }
      next()
    } catch (err) {
      console.log(err)
      res.sendError(401, "invalid token")
    }
  } else {
    res.sendError(401, "token is required")
  }
}
