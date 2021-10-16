import {
  RequestHandler
} from "express"
import {
  rooms
} from "../../web_socket/events"
import {
  createRoomInput,
  createSongsInput
} from "./schema"
import {
  verifyRoomWithId,
  verifyRoomWithName
} from "./utils"
import {
  getRooms as getRoomsFull
} from "./getRooms"
import {
  searchRooms as searchRoomsFull
} from "./searchRooms"
import {
   getSpecificRoom 
} from "./getRoom"
import {
  createRoom as createRoomFull 
} from "./createRoom"
import {
  updateRoom as updateRoomFull 
} from "./updateRoom"
import {
  deleteRoom as deleteRoomFull 
} from "./deleteRoom"
import {
  addSong
} from "./addSongToRoom"

export const getRooms: RequestHandler = async (req, res, next) => {
  try {
      res.sendResponse(
          200,
          getRoomsFull()
      )
  } catch (err) {
      next(err)
  }
}

export const searchRooms: RequestHandler = async (req, res, next) => {
  try {
      const name = req.query.key
      res.sendResponse(200, searchRoomsFull())
  } catch (err) {
      res.sendError(500, `Internal Error`)
  }
}

export const getRoom: RequestHandler = async (req, res, next) => {
  try {
      const id = req.params.id
      try {
          res.sendResponse(200, getSpecificRoom(id, req.user.id));
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
      const {
          name
      } = await createRoomInput.validateAsync(req.body)
      if ((await verifyRoomWithName(name)) == true) {
          res.sendError(409, `Already room with name ${name} exist.`)
          return
      }
      res.sendResponse(200, createRoomFull(name, req.user.id))
      return
  } catch (err) {
      next(err)
  }
}

export const updateRoom: RequestHandler = async (req, res, next) => {
  try {
      const id = req.params.id
      const {
          name
      } = await createRoomInput.validateAsync(req.body)
      try {
          if ((await verifyRoomWithId(id)) == false) {
              res.sendError(404, `No room with id ${id} found.`)
              return
          }
          res.sendResponse(200, updateRoomFull(id, name, req.user.id), "Room details updated.")
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
      res.sendResponse(200, deleteRoomFull(id), "Room Deleted.")
      return
  } catch (err) {
      next(err)
  }
}
export const addSongToRoom: RequestHandler = async (req, res, next) => {
  try {
      const roomId = req.params.id
      const {
          name,
          spotify_url
      } = await createSongsInput.validateAsync(req.body)
      if ((await verifyRoomWithId(roomId)) == false) {
          res.sendError(404, `No such room with roomId ${roomId} exist.`)
          return
      }
      const song = addSong(req.user.id, name, spotify_url, roomId)
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