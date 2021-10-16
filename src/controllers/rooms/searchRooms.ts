import { Room } from "../../entities/room"

export async function searchRooms(){
    return await Room.createQueryBuilder()
    .select()
    .where("name ILIKE :name", {
        name: `%${name}%`,
    })
    .limit(50)
    .getMany()
}