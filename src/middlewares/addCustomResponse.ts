import { sendResponse, sendError } from "../helper/responceHelper"

export const addCustomResponse = (_: any, res: any, next: any) => {
  res.sendResponse = sendResponse
  res.sendError = sendError
  next()
}
