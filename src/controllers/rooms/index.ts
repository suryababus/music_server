import { RequestHandler } from "express"
import { getRepository } from "typeorm"
import { Room } from "../../entities/room"
import { createRoomInput } from "./schema"
import { verifyRoomWithId, verifyRoomWithName} from "./utils"

/**
 * Rooms GET request:
 * Fetches All rooms
 * 
 */
export const getRooms: RequestHandler = async (req, res, next) => {
  try
  {
    res.sendResponse(200, await Room.find({
      take: 50
    }))
    return
  } 
  catch (err) {
    next(err)
  }
  
}

export const searchRooms: RequestHandler = async (req, res, next) => {
  try
  {
    const name = req.params.name;
    const roomDetails = await getRepository(Room)
                              .createQueryBuilder()
                              .select()
                              .where("name ILIKE :name", {
                                name : `%${name}%`
                              }).getMany();
    res.sendResponse(200,roomDetails)
  }
  catch(err){
    res.sendError(500, `Internal Error`)
  }
}

/**
 * Rooms GET request:
 * Fetches rooms with id
 * 
 * @param id
 * @returns Room
 */

export const getRoom: RequestHandler = async (req, res, next) => {
  try
  {
    const id = req.params.id;
    try
    {
      const room = await Room.find({
        id,
      })
      res.sendResponse(200, room)
      return
    }
    catch( err ){
      res.sendError(404, `No such room with id ${id} exist.`)
      return
    }
  } 
  catch (err) {
    next(err)
  }
}

export const joinRoom: RequestHandler = async (req, res, next) => {
  //TODO: join room based on room id
}

/**
 * Rooms POST request:
 * Creates a new room
 * 
 * @param name
 * @returns Room
 * 
 */
export const createRoom: RequestHandler = async (req, res, next) => {
  try 
  {
    const { name } = await createRoomInput.validateAsync(req.body)
    if( await verifyRoomWithName(name) == true){
      res.sendError(409, `Already room with name ${name} exist.`)
      return
    }
    const room = await Room.create({
      name,
    }).save()
    res.sendResponse(200, room)
    return
  } 
  catch (err) {
    next(err)
  }
}
/**
 * Rooms PUT request:
 * Updates the exisiting room with Id
 * 
 * @param id
 * @returns Room
 * 
 */
 export const updateRoom: RequestHandler = async (req, res, next) => {
  try 
  {
    const id = req.params.id;
    const { name } = await createRoomInput.validateAsync(req.body)
    try
    {
      /**
       * Checking whether the room exists or not
       */
      if(await verifyRoomWithId(id) == false){
        res.sendError(404, `No room with id ${id} found.`)
        return
      }
      /**
       * Updating Room Details
       */
      const updatedRoom = await Room.update({
        id,
      },{
        name : name
      });
      res.sendResponse(200, updatedRoom,"Room details updated.")
      return
    }
    catch( err ){
      res.sendError(404, `No such room with id ${id} exist.`)
      return
    }
  } 
  catch (err) {
    next(err)
  }
}
/**
 * Rooms DELETE request:
 * Deletes a exisiting room
 * 
 * @param id
 * 
 */
 export const deleteRoom: RequestHandler = async (req, res, next) => {
  try 
  {
    const id = req.params.id;
    /**
     * Checking whether the room exists or not
     */
    if(await verifyRoomWithId(id) == false){
      res.sendError(404, `No such room with id ${id} exist.`)
      return
    }
    /**
     * Deleting Room
     */
    const deleteRoom = await Room.delete({
      id
    });
    res.sendResponse(200, deleteRoom,"Room Deleted.")
    return
  } 
  catch (err) {
    next(err)
  }
}
export const addSongToRoom: RequestHandler = async (req, res, next) => {
  //TODO: add song to room based on room id
}
