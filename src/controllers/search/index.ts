import { RequestHandler } from "express"
import { searchUsers } from "../login/utils";
import { searchRooms } from "../rooms/utils";
import { searchParams } from "./schema"

export const searchDetails: RequestHandler = async (req, res, next) => {
    try {
      const { category, key } = await searchParams.validateAsync(req.query)
      switch (category) {
            case "users":
                res.sendResponse(200, await searchUsers(key));
                return;

            case "rooms":
                res.sendResponse(200, await searchRooms(key));
                return;
    
            default:
                res.sendError(400, `No such category available`)
                return
      }
    } catch (err) {
      next(err)
    }
  }