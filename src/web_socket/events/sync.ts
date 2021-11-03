export const event = "sync"
import { log } from "../../helper/logger/index"

export const handler = (userId: string, message: any, ws: WebSocket) => {
  log(`handler: user:${userId} message:${message.data}`)
  ws.send(
    JSON.stringify({
      action: "sync",
      data: "",
    })
  )
}
