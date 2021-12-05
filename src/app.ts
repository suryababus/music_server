import "reflect-metadata"
import express from "express"
import { Connection, createConnection } from "typeorm"
import { addRoutes } from "./routes"
import { addCustomResponse } from "./middlewares/addCustomResponse"
import { handleErrorMiddleware } from "./middlewares/handleErrorMiddleware"
import { addWebSocket } from "./web_socket"
import { log } from "./helper/logger/index"
import { startSchedularForAllRooms } from "./helper/schedular"


const bodyParser = require("body-parser")
const cors = require("cors")
let dbConnection: Connection
const connectToDB = async () => {
  try {
    dbConnection = await createConnection()

    log("DB Connected...");
  } catch (error) {
    log(error);
    throw new Error("DB connection failed")
  }
}

export const disconnectDb = async () => {
  if (dbConnection) {
    await dbConnection.close()
    return true
  }
  return false
}

export const startApp = async () => {
  const app = express()
  await connectToDB()
  const port = 4000

  app.use(bodyParser.json())
  app.use(cors())
  app.use(addCustomResponse)

  addRoutes(app)

  app.use(handleErrorMiddleware)

  // add all the routes
  const server = addWebSocket(app)
  await startSchedularForAllRooms()

  if (process.env.NODE_ENV !== 'test') {
    await new Promise((resolve) => {
      server.listen(port, () => { resolve("") })
    })
    log("app running at port : " + port);
  }
  return app
}