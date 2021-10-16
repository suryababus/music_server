import {
    Reaction,
    ReactionEnum
} from "../../entities/reaction"
import {
    Song
} from "../../entities/song";

export async function createReaction(roomId: any, songId: any, userId: any, reaction: ReactionEnum) {
    const createReaction = await Reaction.create({
        searchkey: roomId + ":" + songId + ":" + userId,
        reaction: reaction
    }).save();
    const songData = await Song.find({
        id: songId
    })
    if (reaction === ReactionEnum.Like) {
        updateLike(songId, songData[0].likes.toString(), "addition");
    } else if (reaction === ReactionEnum.Dislike) {
        updateDisLike(songId, songData[0].dislikes.toString(), "addition");
    }
    return createReaction;
}
export async function updateReaction(roomId: any, songId: any, userId: any, existingReaction: ReactionEnum, reaction: ReactionEnum) {
    const updateReaction = await Reaction.update({
        searchkey: roomId + ":" + songId + ":" + userId,
    }, {
        reaction: reaction
    });
    const songData = await Song.find({
        id: songId
    })
    if (reaction === existingReaction) {
        return updateReaction
    }
    if (existingReaction == ReactionEnum.Dislike) {
        updateDisLike(songId, songData[0].dislikes.toString(), "subtraction");
    } else if (existingReaction == ReactionEnum.Like) {
        updateLike(songId, songData[0].likes.toString(), "subtraction");
    }
    if (reaction == ReactionEnum.Dislike) {
        updateDisLike(songId, songData[0].dislikes.toString(), "addition");
    } else if (reaction == ReactionEnum.Like) {
        updateLike(songId, songData[0].likes.toString(), "addition");
    }
    return updateReaction;
}
async function updateLike(songId: any, currentLike: string, operation: string) {
    const like = parseInt(currentLike)
    await Song.update({
        id: songId
    }, {
        likes: operation === "addition" ? like + 1 : like - 1
    });
}
async function updateDisLike(songId: any, currentDisLike: string, operation: string) {
    const dislike = parseInt(currentDisLike)
    await Song.update({
        id: songId
    }, {
        dislikes: operation === "addition" ? dislike + 1 : dislike - 1
    });
}