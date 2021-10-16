import * as WebSocket from "ws"
import * as textMessage from "./text_message"
import * as joinRoom from "./join_room"
import * as sync from "./sync"

type wsUser = {
  ws: WebSocket
  roomId: string
}

export let roomsWS: Record<string, [WebSocket?]> = {}
export let userRoomWS: Record<string, wsUser> = {}

let events: any = {
  text_message: textMessage.handler,
  join_room: joinRoom.handler,
  sync: sync.handler,
}

export const handleEvents = (userId: string, message: any, ws: WebSocket) => {
  const event = message.event as string
  const handler = events[event]
  if (!handler) return
  handler(userId, message, ws)
}
