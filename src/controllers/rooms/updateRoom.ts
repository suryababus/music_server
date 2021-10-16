import { Room } from "../../entities/room"
import { User } from "../../entities/user";

export async function updateRoom(id : any, name : any, user_Id : any){
    const updatedRoom = await Room.update({
        id,
    }, {
        name: name,
        modified_by: User.create({
            id: user_Id,
        }),
    });
    return updatedRoom
}