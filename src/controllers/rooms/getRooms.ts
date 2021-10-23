import { Room } from "../../entities/room"

export const getRooms = async () => {
  return await Room.find({
    relations: ["created_by", "modified_by"],
    take: 50,
  })
}
