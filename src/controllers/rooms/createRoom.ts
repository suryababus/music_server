import { Room } from "../../entities/room"
import { User } from "../../entities/user"

export async function createRoom(user_Id: any, data: any) {
  const { name, song_spotify_uri, song_spotify_image } = data
  const room = await Room.create({
    name,
    song_spotify_uri,
    song_spotify_image,
    created_by: User.create({
      id: user_Id,
    }),
    modified_by: User.create({
      id: user_Id,
    }),
  }).save()
  return room
}
