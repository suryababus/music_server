import * as WebSocket from "ws"
import { rooms, userRoom } from "."

export const event = "join_room"
export const handler = (userId: string, message: any, ws: WebSocket) => {
  console.log(`handler: user:${userId} message:${message.data}`)
  const joinRoomId = message.data
  //   if (rooms[joinRoomId]) {
  if (!rooms[joinRoomId]) {
    rooms[joinRoomId] = []
  }
  rooms[joinRoomId].push(ws)
  userRoom[userId] = {
    roomId: joinRoomId,
    ws: ws,
  }
  ws.send("joined")
  //   } else {
  //     ws.send("room not found")
  //   }
}
