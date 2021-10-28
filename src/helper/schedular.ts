import schedule from "node-schedule"
import { Room } from "../entities/room"
import { Song } from "../entities/song"
import { publishAction } from "../web_socket/actions/actions"
import { actions } from "../web_socket/actions/actionsEnum"

export const currentPlayingSongs: Record<string, any> = {}

export const startSongPlayer = async (roomId: string) => {
  try {
    const currentSong = await popularSong(roomId)
    if (!currentSong) {
      console.log("no songs in room:", roomId)
      currentPlayingSongs[roomId] = null
      return
    }
    const startedMillis = new Date().getTime() + 2000
    const endMillis =
      startedMillis + parseInt(currentSong.duration_ms as string)
    currentPlayingSongs[roomId] = {
      currentSong,
      startedMillis,
    }
    const songs = await Song.find({
      where: {
        room: roomId,
      },
      order: {
        likes: "DESC",
      },
      take: 50,
    })
    publishAction(roomId, actions.SYNC, songs)
    publishAction(roomId, actions.PLAY_SONG, currentPlayingSongs[roomId])
    const job = schedule.scheduleJob(roomId, new Date(endMillis), async () => {
      await removeSong(currentSong.id as string)
      startSongPlayer(roomId)
    })
  } catch (err) {
    console.log("error in schedular", err)
  }
}

const removeSong = async (currentSongId: string): Promise<boolean> => {
  try {
    const song = await Song.findOne({ id: currentSongId })
    await song?.remove()
    return true
  } catch (err) {
    console.log("err in removeSong", err)
  }
  return false
}

const popularSong = async (roomId: string): Promise<Song | null> => {
  try {
    const song = await Song.findOneOrFail({
      where: {
        room: roomId,
      },
      order: {
        likes: "DESC",
      },
    })
    return song
  } catch (err) {
    return null
  }
}

export const startSchedularForAllRooms = async () => {
  const rooms = await Room.find()
  rooms.forEach((room) => {
    startSongPlayer(room.id as string)
  })
}

export const songAddedToRoom = (roomId: string) => {
  console.log(currentPlayingSongs[roomId])
  if (!currentPlayingSongs[roomId]) {
    startSongPlayer(roomId)
  }
}
