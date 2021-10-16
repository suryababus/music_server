import { Room } from "../../entities/room"
import { User } from "../../entities/user";

export async function createRoom(name : any, user_Id : any){
    const room = await Room.create({
        name,
        created_by: User.create({
            id: user_Id,
        }),
        modified_by: User.create({
            id: user_Id,
        }),
    }).save()
    return room;
}