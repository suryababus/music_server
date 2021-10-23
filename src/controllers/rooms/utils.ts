import { Room } from "../../entities/room"
import { Song } from "../../entities/song";
export async function verifyRoomWithId(id : any){
    const alreadyExist = await Room.find({
        id,
    })
    if (alreadyExist.length == 0) {
        return false
    }
    return true;
}
export async function verifyRoomWithName(name : any){
    const alreadyExist = await Room.find({
        name,
    })
    if (alreadyExist.length == 0) {
        return false
    }
    return true;
}
export async function isSongExistsInRoom(spotify_uri : any){
    const alreadyExist = await Song.find({
        spotify_uri,
    })
    if (alreadyExist.length > 0) {
        return true
    }
    return false;
}