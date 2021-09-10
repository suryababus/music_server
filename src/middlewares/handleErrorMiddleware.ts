import { ErrorRequestHandler, Response } from "express"
import { handleError } from "../helper/errorHandling"

//this middleware handles error
export const handleErrorMiddleware: ErrorRequestHandler = async (
  err: any,
  req: any,
  res: Response,
  next: any
) => {
  if (!res.headersSent) {
    handleError(err, res)
  }
}
