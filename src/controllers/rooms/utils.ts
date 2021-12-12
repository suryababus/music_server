import { In } from "typeorm";
import { DeletedSongs } from "../../entities/deletedSongs";
import { Reaction, ReactionEnum } from "../../entities/reaction";
import { Room } from "../../entities/room"
import { Song } from "../../entities/song";
import { User } from "../../entities/user";
import { log } from "../../helper/logger";

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
      relations: ["created_by", "modified_by"],
    })
    const songs = await Song.createQueryBuilder("song").where("song.room = :room_id", { room_id: id }).orderBy("song.likes", "DESC").addOrderBy('song.dislikes', 'ASC').getMany();
    /**
     * Adding Reaction to room object
     */
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
    songs.forEach((songObject) => {
      var currentSKey: string = id + ":" + songObject.id + ":" + user_Id
      if (reactionMap[currentSKey] == undefined) {
        (songObject as any)["reaction"] = ReactionEnum.None
      } else {
        (songObject as any)["reaction"] = reactionMap[currentSKey]
      }
    })
    ;(room as any)["songs"] = songs
    return room
  }
  
export async function getRooms(){
    return await Room.find({
        relations: ["created_by", "modified_by"],
        take: 50,
    })
}
  
export async function searchRooms(name : any){
    return Room.createQueryBuilder("room").where("room.name ILIKE :name", {
      name: `%${name}%`,
    }).limit(50)
    .getMany()
}
  
export async function backupAndDeleteSong(id : any){
  try{
    const song = await Song.createQueryBuilder("song").where("song.id = :id", { id }).loadAllRelationIds().getRawOne()
    
    await DeletedSongs.create({
      name : song?.song_name,
      spotify_uri : song?.song_spotify_uri,
      artist_id : song?.song_artist_id,
      artist_name : song?.song_artist_name,
      duration_ms : song?.song_duration_ms,
      spotify_id : song?.song_spotify_id,
      image_url_large : song?.song_image_url_large,
      image_url_medium : song?.song_image_url_medium,
      image_url_small : song?.song_image_url_small,
      added_by: song?.song_added_by,
      added_by_user_name: song?.song_added_by_user_name,
      likes: song?.song_likes,
      dislikes: song?.song_dislikes,
      room: song?.song_room,
    }).save()
    return await Song.remove(Song.create({id}));
  } catch (e) {
    log(e)
    return
  }
}