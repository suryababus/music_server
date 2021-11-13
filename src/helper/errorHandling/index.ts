import { Response } from "express"
import { formatJoiError } from "./formatJoiError"
import { log } from "../../helper/logger/index"

export const handleError = (err: any, res: Response) => {
  if (err.isJoi) {
    res.sendError(422, formatJoiError(err).message)
  } else {
    log(err);
    res.sendError(500, "internal server error")
  }
}
