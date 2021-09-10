import { Response } from "express"
import { formatJoiError } from "./formatJoiError"

export const handleError = (err: any, res: Response) => {
  if (err.isJoi) {
    res.sendError(422, formatJoiError(err).message)
  } else {
    console.log(err)
    res.sendError(500, "internal server error")
  }
}
