import * as WebSocket from "ws"
import * as textMessage from "./text_message"
import * as joinRoom from "./join_room"
import * as addSong from "./add_song"

type wsUser = {
  ws: WebSocket
  roomId: string
}

export let rooms: Record<string, [WebSocket?]> = {
  surya: [],
}
export let userRoom: Record<string, wsUser> = {}

let events: any = {
  text_message: textMessage.handler,
  join_room: joinRoom.handler,
  add_song: addSong.handler,
}

export const handleEvents = (userId: string, message: any, ws: WebSocket) => {
  const event = message.event as string
  const handler = events[event]
  if (!handler) return
  console.log(event, handler)
  handler(userId, message, ws)
}
