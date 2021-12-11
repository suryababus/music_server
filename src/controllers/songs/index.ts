import { RequestHandler } from "express"
import {getLikedSongsData} from "../../services/songs/getLikedSongs"
import { extractParam } from "./schema"

export const getLikedSongs: RequestHandler = async (req, res, next) => {
    const { room_id, perPage, page} = await extractParam.validateAsync(req.query)
    try {
      res.sendResponse(200, await getLikedSongsData(room_id, perPage, page))
    } catch (err) {
      next(err)
    }
  }