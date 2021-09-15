import express from "express"
import { createRoom , getRooms, getRoom, updateRoom, deleteRoom, searchRooms} from "../controllers/rooms"
import { authenticate } from "../middlewares/authenticate"
const authRoute = express.Router()

const path = "/rooms"
authRoute.use(authenticate)

authRoute.get("/", getRooms)
authRoute.get("/:id",getRoom)
authRoute.get("/search/:name", searchRooms)
authRoute.post("/", createRoom)
authRoute.put("/:id", updateRoom)
authRoute.delete("/:id", deleteRoom)


export const rooms = {
  router: authRoute,
  path,
}
