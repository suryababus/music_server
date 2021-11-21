import express from "express"
import {addReaction} from "../controllers/reaction"
import {authenticate} from "../middlewares/authenticate"
const authRoute = express.Router()

const path = "/reaction"
authRoute.use(authenticate)
authRoute.post("/:room_id/:song_id", addReaction)

export const reaction = {
    router: authRoute,
    path,
}