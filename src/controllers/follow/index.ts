import { RequestHandler } from "express"
import { getFollowersList } from "../../services/follow/getFollowersList"
import { getFollowingList } from "../../services/follow/getFollowingList"
import { followUser } from "../../services/follow/followUser"
import { getFollowersInput, postFollowersInput } from "./schema"

export const getFollowers: RequestHandler = async (req, res, next) => {
    try {
      const {perPage, page} = await getFollowersInput.validateAsync(req.query)
      res.sendResponse(200, await getFollowersList({perPage, page, userId: req.user.id}))
    } catch (err) {
      next(err)
    }
}

export const getFollowing: RequestHandler = async (req, res, next) => {
    try {
      const {perPage, page} = await getFollowersInput.validateAsync(req.query)
      res.sendResponse(200, await getFollowingList({perPage, page, userId: req.user.id}))
    } catch (err) {
      next(err)
    }
}

export const postFollowUser: RequestHandler = async (req, res, next) => {
    try {
      const {userId} = await postFollowersInput.validateAsync(req.params)
      res.sendResponse(200, await followUser(req.user.id, userId))
    } catch (err) {
      if (err instanceof EvalError) {
          res.sendResponse(400, err.message)
      }
      next(err)
    }
}