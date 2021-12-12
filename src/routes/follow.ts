import express from "express"
import { getFollowers, getFollowing, postFollowUser } from "../controllers/follow"
import { authenticate } from "../middlewares/authenticate"
const authRoute = express.Router()

const path = "/"
authRoute.use(authenticate)
authRoute.post("/follow/:userId", postFollowUser);
authRoute.get("/followers", getFollowers)
authRoute.get("/following", getFollowing)

export const follow = {
  router: authRoute,
  path,
}
