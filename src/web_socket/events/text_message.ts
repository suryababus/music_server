export const event = "text_message"
import { log } from "../../helper/logger/index"

export const handler = (userId: string, message: any, ws: WebSocket) => {
  log(`handler: user:${userId} message:${message.data}`)
}
