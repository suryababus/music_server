import express from "express"
import {getLikedSongs} from "../controllers/songs"
import {authenticate} from "../middlewares/authenticate"
const authRoute = express.Router()

const path = "/songs"
authRoute.use(authenticate)
authRoute.get("/liked", getLikedSongs)

export const songs = {
    router: authRoute,
    path,
}