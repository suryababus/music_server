import * as WebSocket from "ws"
import { roomsWS, userRoomWS } from "."
import { log } from "../../helper/logger/index"

export const event = "join_room"
export const handler = (userId: string, message: any, ws: WebSocket) => {
  log(`handler: user:${userId} message:${message.data}`)
  const joinRoomId = message.data
  if (!roomsWS[joinRoomId]) {
    roomsWS[joinRoomId] = []
  }
  const userWS = userRoomWS[userId]
  if (userWS) {
    roomsWS[userWS.roomId] = roomsWS[userWS.roomId].filter(
      (ws) => ws != userWS.ws
    ) as [WebSocket?]
  }
  roomsWS[joinRoomId].push(ws)
  userRoomWS[userId] = {
    roomId: joinRoomId,
    ws: ws,
  }
  ws.send("joined")
}
