import { roomsWS } from "../events"

export const notifyAddedSong = (roomId: string, song: any) => {
  const data = JSON.stringify({
    action: "new_song",
    data: song,
  })
  roomsWS[roomId].forEach((ws) => {
    ws?.send(data)
  })
}

export const notifySongReaction = (roomId: string, song: any) => {
  const data = JSON.stringify({
    action: "song_reaction",
    data: song,
  })
  roomsWS[roomId].forEach((ws) => {
    ws?.send(data)
  })
}
