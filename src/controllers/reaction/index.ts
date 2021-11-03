import { RequestHandler } from "express"
import { Reaction, ReactionEnum } from "../../entities/reaction"
import { createReaction, updateReaction } from "./utils"
import { validateAction } from "./schema"
import { log } from "../../helper/logger/index"

export const addReaction: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { action } = await validateAction.validateAsync(req.body)
    log(req.body);
    const roomId = req.params.room_id
    const songId = req.params.song_id
    const alreadyExist = await Reaction.find({
      searchkey: roomId + ":" + songId + ":" + userId,
    })
    switch (action) {
      case "like": {
        if (alreadyExist.length == 0) {
          createReaction(
            roomId,
            songId,
            userId,
            ReactionEnum.Like,
            req.user.displayName
          )
        } else {
          updateReaction(
            roomId,
            songId,
            userId,
            alreadyExist[0].reaction,
            ReactionEnum.Like,
            req.user.displayName
          )
        }
        break
      }
      case "dislike": {
        if (alreadyExist.length == 0) {
          createReaction(
            roomId,
            songId,
            userId,
            ReactionEnum.Dislike,
            req.user.displayName
          )
        } else {
          updateReaction(
            roomId,
            songId,
            userId,
            alreadyExist[0].reaction,
            ReactionEnum.Dislike,
            req.user.displayName
          )
        }
        break
      }
      case "none": {
        if (alreadyExist.length == 0) {
          createReaction(
            roomId,
            songId,
            userId,
            ReactionEnum.None,
            req.user.displayName
          )
        } else {
          updateReaction(
            roomId,
            songId,
            userId,
            alreadyExist[0].reaction,
            ReactionEnum.None,
            req.user.displayName
          )
        }
        break
      }
      default: {
        res.sendError(400, `No such action available`)
      }
    }
    res.sendResponse(200, "Reaction has been updated for the song")
  } catch (err) {
    next(err)
  }
}
