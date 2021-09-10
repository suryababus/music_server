export function sendResponse(this: any, statusCode: Number, data: any) {
  this.status(statusCode).json({
    status: statusCode,
    data,
  })
}
export function sendError(this: any, statuscode: number, msg: any) {
  this.status(statuscode).json({
    status: statuscode,
    message: msg,
  })
}
