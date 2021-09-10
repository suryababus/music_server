declare namespace Express {
  export interface Response {
    sendResponse: (statusCode: number, data: any) => void
    sendError: (statusCode?: number, msg: any) => void
  }
  export interface Request {
    user: {
      id: string
      email: string
    }
  }
}
