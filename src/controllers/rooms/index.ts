import { RequestHandler } from "express"
import { In } from "typeorm"
import { Reaction, ReactionEnum } from "../../entities/reaction"
import { Room } from "../../entities/room"
import { Song } from "../../entities/song"
import { User } from "../../entities/user"
import { rooms } from "../../web_socket/events"
import { createRoomInput, createSongsInput } from "./schema"
import { verifyRoomWithId, verifyRoomWithName } from "./utils"

export const getRooms: RequestHandler = async (req, res, next) => {
  try {
    res.sendResponse(
      200,
      await Room.find({
        relations: ["created_by", "modified_by"],
        take: 50,
      })
    )
  } catch (err) {
    next(err)
  }
}

export const searchRooms: RequestHandler = async (req, res, next) => {
  try {
    const name = req.query.key
    const roomDetails = await Room.createQueryBuilder()
      .select()
      .where("name ILIKE :name", {
        name: `%${name}%`,
      })
      .limit(50)
      .getMany()
    res.sendResponse(200, roomDetails)
  } catch (err) {
    res.sendError(500, `Internal Error`)
  }
}

export const getRoom: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id
    try {
      const room = await Room.findOne({
        where: { id },
        relations: ["created_by", "modified_by", "songs"],
      });
      /**
       * Adding Reaction to room object
       */
      var songs = room?.songs;
      var searchKeys : string[] = [];
      songs?.forEach((songObject) => {
        searchKeys.push( id+":"+songObject.id+":"+req.user.id );
      });
      const reactions = await Reaction.find({ where: { searchkey: In(searchKeys) } });
      var reactionMap: any = {};
      reactions.forEach(reaction => {
        reactionMap[(reaction.searchkey as string)] = reaction.reaction;
      })
      songs?.forEach((songObject) => {
        var currentSKey : string = id+":"+songObject.id+":"+req.user.id;
        if(reactionMap[currentSKey] == undefined){
          (songObject as any)["reaction"] = ReactionEnum.None;
        }else{
          (songObject as any)["reaction"] = reactionMap[currentSKey];
        }
      });
      res.sendResponse(200, room)
      return
    } catch (err) {
      console.log(err)
      res.sendError(404, `No such room with id ${id} exist.`)
      return
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export const createRoom: RequestHandler = async (req, res, next) => {
  try {
    const { name } = await createRoomInput.validateAsync(req.body)
    if ((await verifyRoomWithName(name)) == true) {
      res.sendError(409, `Already room with name ${name} exist.`)
      return
    }
    const room = await Room.create({
      name,
      created_by: User.create({
        id: req.user.id,
      }),
      modified_by: User.create({
        id: req.user.id,
      }),
    }).save()

    res.sendResponse(200, room)
    return
  } catch (err) {
    next(err)
  }
}

export const updateRoom: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id
    const { name } = await createRoomInput.validateAsync(req.body)
    try {
      /**
       * Checking whether the room exists or not
       */
      if ((await verifyRoomWithId(id)) == false) {
        res.sendError(404, `No room with id ${id} found.`)
        return
      }
      /**
       * Updating Room Details
       */
      const updatedRoom = await Room.update(
        {
          id,
        },
        {
          name: name,
          modified_by: User.create({
            id: req.user.id,
          }),
        }
      )
      res.sendResponse(200, updatedRoom, "Room details updated.")
      return
    } catch (err) {
      res.sendError(404, `No such room with id ${id} exist.`)
      return
    }
  } catch (err) {
    next(err)
  }
}

export const deleteRoom: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id
    /**
     * Checking whether the room exists or not
     */
    if ((await verifyRoomWithId(id)) == false) {
      res.sendError(404, `No such room with id ${id} exist.`)
      return
    }
    /**
     * Deleting Room
     */
    const deleteRoom = await Room.delete({
      id,
    })
    res.sendResponse(200, deleteRoom, "Room Deleted.")
    return
  } catch (err) {
    next(err)
  }
}
export const addSongToRoom: RequestHandler = async (req, res, next) => {
  try {
    const roomId = req.params.id
    const { name, spotify_url } = await createSongsInput.validateAsync(req.body)
    if ((await verifyRoomWithId(roomId)) == false) {
      res.sendError(404, `No such room with roomId ${roomId} exist.`)
      return
    }
    const userId = req.user.id
    const user = await User.findOneOrFail({ id: userId })
    var song:any = "";
    for(var i = 0 ; i < 10000 ; i++){
    song = await Song.create({
      name: name+i,
      added_by: User.create({
        id: userId,
      }),
      added_by_user_name: user?.name || "",
      spotify_url: spotify_url+i,
      likes: 0,
      dislikes: 0,
      room: await Room.findOne({
        id: roomId,
      }),
    }).save()
    }
    res.sendResponse(200, song)
    rooms[roomId].forEach((ws) => {
      try {
        ws?.send(
          JSON.stringify({
            action: "song_added",
            data: song,
          })
        )
      } catch (err) {
        console.log(err)
        if (ws?.CLOSED) {
          const index = rooms[roomId].indexOf(ws)
          rooms[roomId].splice(index, 1)
        }
      }
    })
    return
  } catch (err) {
    next(err)
  }
}
