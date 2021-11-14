import { RequestHandler } from "express"
import { Reaction, ReactionEnum } from "../../entities/reaction"
import { createReaction, updateReaction } from "./utils"
import { validateAction } from "./schema"
import { log } from "../../helper/logger/index"

export const addReaction: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { action } = await validateAction.validateAsync(req.body)
    const roomId = req.params.room_id
    const songId = req.params.song_id
    const alreadyExist = await Reaction.findOne({
      searchkey: roomId + ":" + songId + ":" + userId,
    })
    var actionRequired : ReactionEnum = ReactionEnum.None;
    switch (action) {
      case "like": 
        actionRequired = ReactionEnum.Like;
        break;
      case "dislike": 
        actionRequired = ReactionEnum.Dislike;
        break;
      case "none":
        actionRequired = ReactionEnum.None;
        break;
      default: 
        res.sendError(400, `No such action available`)
        return
    }
    if (alreadyExist === undefined) {
      try{
        const createdReaction = await createReaction(
          roomId,
          songId,
          userId,
          actionRequired,
          req.user.displayName
        )
        res.sendResponse(200, createdReaction)
      }catch(err){
        res.sendError(400, err)
      }
    } else {
      try{
        const updatedReaction = await updateReaction(
          roomId,
          songId,
          userId,
          alreadyExist.reaction,
          actionRequired,
          req.user.displayName
        )
        res.sendResponse(200, updatedReaction)
      }catch(err){
        res.sendError(400, err)
      }
    }
  } catch (err) {
    next(err)
  }
}
