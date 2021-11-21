import { Reaction, ReactionEnum } from "../../entities/reaction"
import { Song } from "../../entities/song"
import { log } from "../../helper/logger"
import { publishAction } from "../../web_socket/actions/actions"
import { actions } from "../../web_socket/actions/actionsEnum"
import { backupAndDeleteSong } from "../rooms/utils"

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
  const songData = await Song.findOne({
    id: songId,
  })
  if (songData === undefined) {
    throw "No such song found!."
  }
  if (reaction === ReactionEnum.Like) {
    updateLike(songId, songData.likes.toString(), "addition")
  } else if (reaction === ReactionEnum.Dislike) {
    updateDisLike(songId, songData.dislikes.toString(), "addition")
  }
  const songDataAfterUpdate = await Song.findOne({
    id: songId,
  })
  var reactionsObject = {};
  (reactionsObject as any)["likes"] = songDataAfterUpdate!.likes;
  (reactionsObject as any)["dislikes"] = songDataAfterUpdate!.dislikes;
  (reactionsObject as any)["user_name"] = userName;
  (reactionsObject as any)["user_id"] = userId;
  (reactionsObject as any)["song_id"] = songData.id;
  (reactionsObject as any)["song_name"] = songData.name;
  (reactionsObject as any)["reaction"] = reaction;
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
  const updateReaction = await Reaction.update({
    searchkey: roomId + ":" + songId + ":" + userId,
  },{
    reaction: reaction,
  })
  const songData = await Song.findOne({
    id: songId,
  })
  if (songData === undefined) {
    throw "No such song found!."
  }
  if (reaction === existingReaction) {
    return "Same reaction exists"
  }
  if (existingReaction == ReactionEnum.Dislike) {
    updateDisLike(songId, songData!.dislikes.toString(), "subtraction")
  } else if (existingReaction == ReactionEnum.Like) {
    updateLike(songId, songData!.likes.toString(), "subtraction")
  }
  if (reaction == ReactionEnum.Dislike) {
    updateDisLike(songId, songData!.dislikes.toString(), "addition")
  } else if (reaction == ReactionEnum.Like) {
    updateLike(songId, songData!.likes.toString(), "addition")
  }
  const songDataAfterUpdate = await Song.findOne({
    id: songId,
  })
  var reactionsObject = {};
  (reactionsObject as any)["likes"] = songDataAfterUpdate!.likes;
  (reactionsObject as any)["dislikes"] = songDataAfterUpdate!.dislikes;
  (reactionsObject as any)["user_name"] = userName;
  (reactionsObject as any)["user_id"] = userId;
  (reactionsObject as any)["song_id"] = songData!.id;
  (reactionsObject as any)["song_name"] = songData!.name;
  (reactionsObject as any)["reaction"] = reaction;
  publishAction(roomId, actions.REACTION, reactionsObject)
  if(await isSongMostDisliked(songDataAfterUpdate!)){
    backupAndDeleteSong(songDataAfterUpdate?.id)
  }
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
async function isSongMostDisliked(song: Song) {
  if(song === undefined){
    return false
  }
  const likes : string = String(song.likes)
  const dislikes : string = String(song.dislikes)
  const createdTime : Date = song.added_time;
  const timeDiff = getTimeDifference(createdTime.getTime(), Date.now())
  if(parseInt(dislikes) > parseInt(likes) * 2 && timeDiff >= 10){
    return true;
  }
  return false;
}
function getTimeDifference(millis1 : number, millis2 : number){
  var diffMs = (millis2 - millis1);
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
  return diffMins;
}
