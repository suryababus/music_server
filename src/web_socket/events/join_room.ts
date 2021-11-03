import * as WebSocket from "ws"
import { roomsWS, userRoomWS } from "."
import { currentPlayingSongs } from "../../helper/schedular"
import { sentActionForUser } from "../actions/actions"
import { actions } from "../actions/actionsEnum"
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
  // if (!currentPlayingSongs[joinRoomId]) return
  log("sent play song")
  let currentPlayingSong = currentPlayingSongs[joinRoomId]
  if (!currentPlayingSong) return
  currentPlayingSong["currentMillis"] = new Date().getTime()
  sentActionForUser(ws, actions.PLAY_SONG, currentPlayingSong)
}
