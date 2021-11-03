import { Express } from "express"
import * as http from "http"
import * as WebSocket from "ws"
import { verifyToken } from "../middlewares/authenticate"
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

    ws.on("message", (message: any) => {
      try {
        const msgObj = JSON.parse(message.toString())
        const token = msgObj.token
        let userId = ""
        if (token) {
          const { id } = verifyToken(token)
          userId = id
        } else {
          ws.send("token required")
          throw "Error2"
        }
        handleEvents(userId, msgObj, ws)
        // Message received
        // switch radio
        // like song
        // dislike song
        // add song
        // sync songs
        // Text Message
        // clients.forEach((ws) => {
        //   ws.send(`Message: ${message}`)
        // })
      } catch (err) {
        ws.send(`error: ${err}`)
        log(err);
        ws.close()
      }
    })

    ws.on("upgrade", (request) => {
      // check authentication and add to radio array
      request.headers.authorization
      ws.close()
    })

    //send immediatly a feedback to the incoming connection
    ws.send("Joined")
    clients.push(ws)
  })
  return server
}
