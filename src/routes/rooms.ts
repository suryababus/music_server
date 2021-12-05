import express from "express"
import { createRoom , getRooms, getRoom, updateRoom, deleteRoom, searchRooms, addSongToRoom} from "../controllers/rooms"
import { authenticate } from "../middlewares/authenticate"
const route = express.Router()

const path = "/rooms"
route.use(authenticate)

route.get("/", getRooms)
route.get("/search", searchRooms)
route.post("/:id/songs", addSongToRoom)
route.get("/:id",getRoom)
route.post("/", createRoom)
route.put("/:id", updateRoom)
route.delete("/:id", deleteRoom)

export const rooms = {
  router: route,
  path,
}
