import { roomsWS } from "../events"
import { actions } from "./actionsEnum"

export const sentAction = (roomId: string, action: actions, data?: any) => {
  console.log(roomId, roomsWS[roomId], action)
  if (!roomsWS[roomId]) return
  roomsWS[roomId].forEach((ws) => {
    try {
      ws?.send(
        JSON.stringify({
          action: action,
          data: data,
        })
      )
    } catch (err) {
      console.log(err)
      // if (ws?.CLOSED) {
      //   const index = roomsWS[roomId].indexOf(ws)
      //   roomsWS[roomId].splice(index, 1)
      // }
    }
  })
}
