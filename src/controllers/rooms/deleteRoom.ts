import { Room } from "../../entities/room"

export async function getRooms(){
    return await Room.find({
        relations: ["created_by", "modified_by"],
        take: 50,
    })
}