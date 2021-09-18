import { Room } from "../../entities/room"
import { User } from "../../entities/user";
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