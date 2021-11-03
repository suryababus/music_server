import { RequestHandler } from "express"
import { createRoomInput, createSongsInput } from "./schema"
import { deleteRoom as deleteRoomHandler, updateRoom as updateRoomHandler, createRoom as createRoomHandler, getSpecificRoom, addSong, isSongExistsInRoom, verifyRoomWithId, verifyRoomWithName, getRooms as getAllRooms, searchRooms as searchRoomsFull} from "./utils"
import { sentAction } from "../../web_socket/actions/actions"
import { actions } from "../../web_socket/actions/actionsEnum"
import { log } from "../../helper/logger/index"

export const getRooms: RequestHandler = async (req, res, next) => {
  try {
    res.sendResponse(200, await getAllRooms())
  } catch (err) {
    next(err)
  }
}

export const searchRooms: RequestHandler = async (req, res, next) => {
  try {
    const name = req.query.key
    res.sendResponse(200, searchRoomsFull())
  } catch (err) {
    next(err)
  }
}

export const getRoom: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id
    res.sendResponse(200, await getSpecificRoom(id, req.user.id))
    return
  } catch (err) {
    next(err)
  }
}

export const createRoom: RequestHandler = async (req, res, next) => {
  try {
    const data = await createRoomInput.validateAsync(req.body)
    if ((await verifyRoomWithName(data.name)) == true) {
      res.sendError(409, `Already room with name ${name} exist.`)
      return
    }
    res.sendResponse(200, await createRoomHandler(req.user.id, data))
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
      if ((await verifyRoomWithId(id)) == false) {
        res.sendError(404, `No room with id ${id} found.`)
        return
      }
      res.sendResponse(
        200,
        updateRoomHandler(id, name, req.user.id),
        "Room details updated."
      )
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
    if ((await verifyRoomWithId(id)) == false) {
      res.sendError(404, `No such room with id ${id} exist.`)
      return
    }
    res.sendResponse(200, deleteRoomHandler(id), "Room Deleted.")
    return
  } catch (err) {
    next(err)
  }
}
export const addSongToRoom: RequestHandler = async (req, res, next) => {
  try {
    const roomId = req.params.id
    const data = await createSongsInput.validateAsync(req.body)
    if ((await verifyRoomWithId(roomId)) == false) {
      res.sendError(404, `No such room with roomId ${roomId} exist.`)
      return
    }
    const { spotify_uri } = data;
    if ((await isSongExistsInRoom(spotify_uri))) {
      res.sendError(404, `Song already added in Room - ${roomId} .`)
      return
    }
    const song = await addSong(req.user.id, roomId, data)
    res.sendResponse(200, song)
    sentAction(roomId, actions.SONG_ADDED, song)
    return
  } catch (err) {
    log(err);
    next(err)
  }
}
