import { Room } from "../../entities/room"

export async function deleteRoom(id : any){
    return await Room.delete({
        id,
    })
}