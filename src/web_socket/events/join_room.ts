import * as WebSocket from "ws"
import { roomsWS, userRoomWS } from "."

export const event = "join_room"
export const handler = (userId: string, message: any, ws: WebSocket) => {
  console.log(`handler: user:${userId} message:${message.data}`)
  const joinRoomId = message.data
  if (!roomsWS[joinRoomId]) {
    roomsWS[joinRoomId] = []
  }
  roomsWS[joinRoomId].push(ws)
  userRoomWS[userId] = {
    roomId: joinRoomId,
    ws: ws,
  }
  ws.send("joined")
}
