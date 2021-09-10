import express from "express"
import { createRoom } from "../controllers/rooms"
import { authenticate } from "../middlewares/authenticate"
const authRoute = express.Router()

const path = "/rooms"
authRoute.use(authenticate)

authRoute.post("/", createRoom)

export const rooms = {
  router: authRoute,
  path,
}
