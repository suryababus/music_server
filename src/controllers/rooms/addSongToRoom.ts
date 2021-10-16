import { Room } from "../../entities/room"
import { Song } from "../../entities/song"
import { User } from "../../entities/user"

export async function addSong(userId : any , name : any, spotify_url : any, roomId : any){
    const user = await User.findOneOrFail({
        id: userId
    })
    const song = await Song.create({
        name: name,
        added_by: User.create({
            id: userId,
        }),
        added_by_user_name: user?.name || "",
        spotify_url: spotify_url,
        likes: 0,
        dislikes: 0,
        room: await Room.findOne({
            id: roomId,
        }),
    }).save()
    return song;
}