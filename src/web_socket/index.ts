import { Express } from "express"
import * as http from "http"
import * as WebSocket from "ws"
import { verifyToken } from "../middlewares/authenticate"
import { sentActionForUser } from "./actions/actions"
import { actions } from "./actions/actionsEnum"
import { handleEvents } from "./events"
import { log } from "../helper/logger/index"

//web socket
export const addWebSocket = (app: Express): http.Server => {
  const clients: WebSocket[] = []
  //initialize a simple http server
  const server = http.createServer(app)

  //initialize the WebSocket server instance
  const wss = new WebSocket.Server({ server })

  wss.on("connection", (ws: WebSocket) => {
    //connection is up
    sentActionForUser(ws, actions.CONNECTED, "ok")
    ws.on("message", (message: any) => {
      try {
        const msgObj = JSON.parse(message.toString())
        const token = msgObj.token
        let userId = ""
        let userName=""
        if (token) {
          const { id, displayName }  = verifyToken(token)
          userId = id
          userName = displayName
        } else {
          ws.send("token required")
          throw "token required"
        }
        handleEvents(userId,userName, msgObj, ws)
      } catch (err) {
        ws.send(`error: ${err}`)
        log(err)
        ws.close()
      }
    })

    ws.on("upgrade", (request) => {
      // check authentication and add to radio array
      request.headers.authorization
      ws.close()
    })
    ws.on("ping", (message: any) => {
      log("client pinged")
      sentActionForUser(ws, actions.PING, "ok")
    })
    clients.push(ws)
  })
  return server
}
