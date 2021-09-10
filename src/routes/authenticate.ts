import express from "express"
import SpotifyWebApi from "spotify-web-api-node"
import { login } from "../controllers/login"

const spotify = new SpotifyWebApi()

const authRoute = express.Router()

const path = "/auth"

authRoute.post("/login", login)

export const authenticate = {
  router: authRoute,
  path,
}
