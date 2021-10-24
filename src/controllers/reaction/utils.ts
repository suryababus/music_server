import { Reaction, ReactionEnum } from "../../entities/reaction"
import { Song } from "../../entities/song"
import { publishAction } from "../../web_socket/actions/actions"
import { actions } from "../../web_socket/actions/actionsEnum"

export async function createReaction(
  roomId: any,
  songId: any,
  userId: any,
  reaction: ReactionEnum,
  userName: any
) {
  const createReaction = await Reaction.create({
    searchkey: roomId + ":" + songId + ":" + userId,
    reaction: reaction,
  }).save()
  const songData = await Song.find({
    id: songId,
  })
  if (reaction === ReactionEnum.Like) {
    updateLike(songId, songData[0].likes.toString(), "addition")
  } else if (reaction === ReactionEnum.Dislike) {
    updateDisLike(songId, songData[0].dislikes.toString(), "addition")
  }
  const songDataAfterUpdate = await Song.find({
    id: songId,
  })

  var reactionsObject = {}
  ;(reactionsObject as any)["likes"] = songDataAfterUpdate[0].likes
  ;(reactionsObject as any)["dislikes"] = songDataAfterUpdate[0].dislikes
  ;(reactionsObject as any)["name"] = userName
  publishAction(roomId, actions.REACTION, reactionsObject)

  return createReaction
}
export async function updateReaction(
  roomId: any,
  songId: any,
  userId: any,
  existingReaction: ReactionEnum,
  reaction: ReactionEnum,
  userName: any
) {
  const updateReaction = await Reaction.update(
    {
      searchkey: roomId + ":" + songId + ":" + userId,
    },
    {
      reaction: reaction,
    }
  )
  const songData = await Song.find({
    id: songId,
  })
  if (reaction === existingReaction) {
    return updateReaction
  }
  if (existingReaction == ReactionEnum.Dislike) {
    updateDisLike(songId, songData[0].dislikes.toString(), "subtraction")
  } else if (existingReaction == ReactionEnum.Like) {
    updateLike(songId, songData[0].likes.toString(), "subtraction")
  }
  if (reaction == ReactionEnum.Dislike) {
    updateDisLike(songId, songData[0].dislikes.toString(), "addition")
  } else if (reaction == ReactionEnum.Like) {
    updateLike(songId, songData[0].likes.toString(), "addition")
  }
  const songDataAfterUpdate = await Song.find({
    id: songId,
  })
  var reactionsObject = {}
  ;(reactionsObject as any)["likes"] = songDataAfterUpdate[0].likes
  ;(reactionsObject as any)["dislikes"] = songDataAfterUpdate[0].dislikes
  ;(reactionsObject as any)["name"] = userName
  publishAction(roomId, actions.REACTION, reactionsObject)

  return updateReaction
}
async function updateLike(songId: any, currentLike: string, operation: string) {
  const like = parseInt(currentLike)
  await Song.update(
    {
      id: songId,
    },
    {
      likes: operation === "addition" ? like + 1 : like - 1,
    }
  )
}
async function updateDisLike(
  songId: any,
  currentDisLike: string,
  operation: string
) {
  const dislike = parseInt(currentDisLike)
  await Song.update(
    {
      id: songId,
    },
    {
      dislikes: operation === "addition" ? dislike + 1 : dislike - 1,
    }
  )
}
