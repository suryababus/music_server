import { RequestHandler } from "express"
import { Room } from "../../entities/room"
import { createRoomInput } from "./schema"

/**
 * Rooms GET request:
 * Fetches All rooms
 * 
 */
export const getRooms: RequestHandler = async (req, res, next) => {
  try{
    res.sendResponse(200, await Room.find({}))
    return
  } catch (err) {
    next(err)
  }
  
}

export const searchRooms: RequestHandler = async (req, res, next) => {
  //TODO: search rooms based on name limit result to 20
}

/**
 * Rooms GET request:
 * Fetches rooms with id
 * 
 * @param id
 * @returns Room
 */

export const getRoom: RequestHandler = async (req, res, next) => {
  try{
    const id = req.params.id;
    var curr_room;
    try{
      const room = await Room.find({
        id,
      })
      curr_room = room
    }catch( err ){
      res.sendError(404, `No such room with id ${id} exist.`)
    }
    res.sendResponse(200, curr_room)
  } catch (err) {
    next(err)
  }
}

export const joinRoom: RequestHandler = async (req, res, next) => {
  //TODO: join room based on room id
}

/**
 * Rooms POST request:
 * Craetes a new room
 * 
 * @param name
 * @returns Room
 * 
 */
export const createRoom: RequestHandler = async (req, res, next) => {
  try {
    const { name } = await createRoomInput.validateAsync(req.body)

    const alreadyExist = await Room.find({
      name,
    })
    if (alreadyExist.length > 0) {
      res.sendError(409, `Already room with name ${name} exist.`)
      return
    }

    const room = await Room.create({
      name,
    }).save()
    res.sendResponse(200, room)
    return
  } catch (err) {
    next(err)
  }
}

export const addSongToRoom: RequestHandler = async (req, res, next) => {
  //TODO: add song to room based on room id
}
