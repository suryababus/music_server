import { RequestHandler } from "express"
import {getLikedSongsData} from "../../services/songs/getLikedSongs"
import { getLikedSongsInput } from "./schema"

export const getLikedSongs: RequestHandler = async (req, res, next) => {
  try {
    const { roomId, perPage, page} = await getLikedSongsInput.validateAsync(req.query)
    try {
      res.sendResponse(200, await getLikedSongsData({roomId, perPage, page, userId: req.user.id}))
    } catch (err) {
      next(err)
    }
    
  } catch (error) {
    next(error)
  }
  }