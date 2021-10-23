import { roomsWS } from "."

export const sentAction = (roomId: string, action: string, data?: any) => {
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
      if (ws?.CLOSED) {
        const index = roomsWS[roomId].indexOf(ws)
        roomsWS[roomId].splice(index, 1)
      }
    }
  })
}
