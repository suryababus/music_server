import express from "express"
import { createRoom , getRooms, getRoom} from "../controllers/rooms"
import { authenticate } from "../middlewares/authenticate"
const authRoute = express.Router()

const path = "/rooms"
authRoute.use(authenticate)

authRoute.post("/create", createRoom)
authRoute.get("/", getRooms)
authRoute.get("/:id",getRoom)

export const rooms = {
  router: authRoute,
  path,
}
