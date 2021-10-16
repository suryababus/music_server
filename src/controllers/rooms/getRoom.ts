import { In } from "typeorm";
import { Reaction, ReactionEnum } from "../../entities/reaction";
import { Room } from "../../entities/room"

export async function getSpecificRoom(id : any, user_Id : any){
    const room = await Room.findOne({
        where: {
            id
        },
        relations: ["created_by", "modified_by", "songs"],
    });
    /**
     * Adding Reaction to room object
     */
    var songs = room?.songs;
    var searchKeys: string[] = [];
    songs?.forEach((songObject) => {
        searchKeys.push(id + ":" + songObject.id + ":" + user_Id);
    });
    const reactions = await Reaction.find({
        where: {
            searchkey: In(searchKeys)
        }
    });
    var reactionMap: any = {};
    reactions.forEach(reaction => {
        reactionMap[(reaction.searchkey as string)] = reaction.reaction;
    })
    songs?.forEach((songObject) => {
        var currentSKey: string = id + ":" + songObject.id + ":" + user_Id;
        if (reactionMap[currentSKey] == undefined) {
            (songObject as any)["reaction"] = ReactionEnum.None;
        } else {
            (songObject as any)["reaction"] = reactionMap[currentSKey];
        }
    });
    return room;
}