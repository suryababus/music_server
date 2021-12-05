import * as WebSocket from "ws"
import * as textMessage from "./text_message"
import * as joinRoom from "./join_room"
import * as sync from "./sync"

type wsRoom = {
  ws: WebSocket
  roomId: string
}
type wsUser = {
  ws: WebSocket
  userId: string
}

export let roomsWS: Record<string, [WebSocket?]> = {}
export let userRoomWS: Record<string, wsRoom> = {}

let events: any = {
  text_message: textMessage.handler,
  join_room: joinRoom.handler,
  sync: sync.handler,
}

export const handleEvents = (userId: string,userName: string, message: any, ws: WebSocket) => {
  const event = message.event as string
  const handler = events[event]
  if (!handler) return
  handler(userId,userName, message, ws)
}
