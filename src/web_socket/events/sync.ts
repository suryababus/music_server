import { Song } from "../../entities/song"
import { userRoomWS } from "./index"
import { currentPlayingSongs } from "../../helper/schedular"
import { actions } from "../actions/actionsEnum"
import { sentActionForUser } from "../actions/actions"

export const event = "sync"
export const handler = async (userId: string, message: any, ws: WebSocket) => {
  console.log(`handler: user:${userId} message:${message.data}`)
  const { roomId } = userRoomWS[userId]
  const songs = await Song.find({
    where: {
      room: roomId,
    },
    order: {
      likes: "DESC",
    },
    take: 50,
  })
  sentActionForUser(ws, actions.SYNC, {
    songs,
    currentPlayingSong: currentPlayingSongs[roomId],
  })
}
