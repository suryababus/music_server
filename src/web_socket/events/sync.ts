import { Song } from "../../entities/song"
import * as WebSocket from "ws"
import { userRoomWS } from "./index"
import { currentPlayingSongs } from "../../helper/schedular"
import { actions } from "../actions/actionsEnum"
import { sentActionForUser } from "../actions/actions"
import { log } from "../../helper/logger/index"

export const event = "sync"
export const handler = async (userId: string, message: any, ws: WebSocket) => {
  log(`handler: user:${userId} message:${message.data}`)
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
  })
  let currentPlayingSong = currentPlayingSongs[roomId]
  if (!currentPlayingSong) return
  currentPlayingSong["currentMillis"] = new Date().getTime()
  sentActionForUser(ws, actions.PLAY_SONG, currentPlayingSong)
}
