import { In } from "typeorm";
import { Reaction, ReactionEnum } from "../../entities/reaction";
import { Room } from "../../entities/room"
import { Song } from "../../entities/song";
import { User } from "../../entities/user";

export async function verifyRoomWithId(id : any){
    const alreadyExist = await Room.find({
        id,
    })
    if (alreadyExist.length == 0) {
        return false
    }
    return true;
}
export async function verifyRoomWithName(name : any){
    const alreadyExist = await Room.find({
        name,
    })
    if (alreadyExist.length == 0) {
        return false
    }
    return true;
}
export async function isSongExistsInRoom(spotify_uri : any){
    const alreadyExist = await Song.find({
        spotify_uri,
    })
    if (alreadyExist.length > 0) {
        return true
    }
    return false;
}
export async function addSong(userId: String, roomId: String, data: any) {
    const {
      spotify_id,
      spotify_uri,
      name,
      artist_id,
      artist_name,
      image_url_large,
      image_url_medium,
      image_url_small,
      duration_ms,
    } = data
    const user = await User.findOneOrFail({
      id: userId,
    })
    const song = await Song.create({
      name,
      spotify_uri,
      artist_id,
      artist_name,
      duration_ms,
      spotify_id,
      image_url_large,
      image_url_medium,
      image_url_small,
      added_by: User.create({
        id: userId,
      }),
      added_by_user_name: user?.name || "",
      likes: 0,
      dislikes: 0,
      room: await Room.findOne({
        id: roomId,
      }),
    }).save()
    return song
  }
  
export async function updateRoom(id : any, name : any, user_Id : any){
    const updatedRoom = await Room.update({
        id,
    }, {
        name: name,
        modified_by: User.create({
            id: user_Id,
        }),
    });
    return updatedRoom
}

export async function createRoom(user_Id: any, data: any) {
    const { name, song_spotify_uri, song_spotify_image } = data
    const room = await Room.create({
      name,
      song_spotify_uri,
      song_spotify_image,
      created_by: User.create({
        id: user_Id,
      }),
      modified_by: User.create({
        id: user_Id,
      }),
    }).save()
    return room
}
  
export async function deleteRoom(id : any){
    return await Room.delete({
        id,
    })
}

export async function getSpecificRoom(id: any, user_Id: any) {
    const room = await Room.findOne({
      where: {
        id,
      },
      relations: ["created_by", "modified_by", "songs"],
    })
    // const room = await Room.createQueryBuilder().where().leftJoin('created_by','created_by').getOne()
    /**
     * Adding Reaction to room object
     */
    var songs = room?.songs
    var searchKeys: string[] = []
    songs?.forEach((songObject) => {
      searchKeys.push(id + ":" + songObject.id + ":" + user_Id)
    })
    const reactions = await Reaction.find({
      where: {
        searchkey: In(searchKeys),
      },
    })
    var reactionMap: any = {}
    reactions.forEach((reaction) => {
      reactionMap[reaction.searchkey as string] = reaction.reaction
    })
    songs?.forEach((songObject) => {
      var currentSKey: string = id + ":" + songObject.id + ":" + user_Id
      if (reactionMap[currentSKey] == undefined) {
        ;(songObject as any)["reaction"] = ReactionEnum.None
      } else {
        ;(songObject as any)["reaction"] = reactionMap[currentSKey]
      }
    })
    songs?.sort((a, b) => {
      return a.likes > b.likes ? -1 : 1;
    });
    return room
  }
  
export async function getRooms(){
    return await Room.find({
        relations: ["created_by", "modified_by"],
        take: 50,
    })
}
  
export async function searchRooms(){
    return await Room.createQueryBuilder()
    .select()
    .where("name ILIKE :name", {
        name: `%${name}%`,
    })
    .limit(50)
    .getMany()
}