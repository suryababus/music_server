import { roomsWS } from "../events"
import { actions } from "./actionsEnum"

export const publishAction = (roomId: string, action: actions, data?: any) => {
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
    }
  })
}

export const sentActionForUser = (
  ws: WebSocket,
  action: actions,
  data?: any
) => {
  try {
    ws?.send(
      JSON.stringify({
        action: action,
        data: data,
      })
    )
  } catch (err) {
    console.log(err)
  }
}
