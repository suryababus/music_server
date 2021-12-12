import express from "express"
import { Follower } from "../entities/follower"
import { User } from "../entities/user"
import { authenticate } from "../middlewares/authenticate"
const authRoute = express.Router()

const path = "/follow"

authRoute.use(authenticate)

authRoute.post("/:userId", (req, res) => {

    const followUserId = req.params.userId
   const follower =  Follower.create({
        following: User.create({id:followUserId}),
        user: User.create({id:req.user.id}),
    });
    follower.save()


  res.sendResponse(200,req.params)
})

export const follow = {
  router: authRoute,
  path,
}
