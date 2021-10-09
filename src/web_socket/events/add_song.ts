import * as WebSocket from "ws"
import { rooms, userRoom } from "."

export const event = "add_song"
export const handler = (userId: string, message: any, ws: WebSocket) => {
  console.log(`handler: user:${userId} message:${message.data}`)
  const song = message.data
  console.log(rooms[userRoom[userId].roomId].length)
  rooms[userRoom[userId].roomId].forEach((ws) => {
    ws?.send(
      JSON.stringify({
        action: "song_added",
        data: song,
      })
    )
  })
}
