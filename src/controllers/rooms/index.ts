import { RequestHandler } from "express"
import { Room } from "../../entities/room"
import { createRoomInput } from "./schema"

export const getRooms: RequestHandler = (req, res, next) => {
  //TODO: Get rooms based on popularity limit result to 20
}

export const searchRooms: RequestHandler = async (req, res, next) => {
  //TODO: search rooms based on name limit result to 20
}

export const getRoom: RequestHandler = async (req, res, next) => {
  //TODO: get room based on room id
}

export const joinRoom: RequestHandler = async (req, res, next) => {
  //TODO: join room based on room id
}

export const createRoom: RequestHandler = async (req, res, next) => {
  //TODO: create room
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
