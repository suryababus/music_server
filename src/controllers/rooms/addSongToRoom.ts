import { Room } from "../../entities/room"
import { Song } from "../../entities/song"
import { User } from "../../entities/user"

export async function addSong(userId: String, roomId: String, data: any) {
  const {
    spotify_id,
    spotify_uri,
    name,
    artist_id,
    artist_name,
    image_url_large,
    image_url_medium,
    image_url_small,
    duration_ms,
  } = data
  const user = await User.findOneOrFail({
    id: userId,
  })
  const song = await Song.create({
    name,
    spotify_uri,
    artist_id,
    artist_name,
    duration_ms,
    spotify_id,
    image_url_large,
    image_url_medium,
    image_url_small,
    added_by: User.create({
      id: userId,
    }),
    added_by_user_name: user?.name || "",
    likes: 0,
    dislikes: 0,
    room: await Room.findOne({
      id: roomId,
    }),
  }).save()
  return song
}
