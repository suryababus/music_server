import express from "express"
import { getFollowers, getFollowing, postFollowUser } from "../controllers/follow"
import { authenticate } from "../middlewares/authenticate"
const authRoute = express.Router()

const path = "/follow"
authRoute.use(authenticate)
authRoute.post("/:userId", postFollowUser);
authRoute.get("/followers", getFollowers)
authRoute.get("/following", getFollowing)

export const follow = {
  router: authRoute,
  path,
}
