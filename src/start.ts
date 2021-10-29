import "reflect-metadata"
import express, { ErrorRequestHandler, NextFunction, Response } from "express"
import { createConnection } from "typeorm"
import { addRoutes } from "./routes"
import { addCustomResponse } from "./middlewares/addCustomResponse"
import { handleErrorMiddleware } from "./middlewares/handleErrorMiddleware"
import { addWebSocket } from "./web_socket"
import { startSchedularForAllRooms } from "./helper/schedular"

process.on("uncaughtException", (err) => {
  console.log(err)
})

const bodyParser = require("body-parser")
const cors = require("cors")

const connectToDB = async () => {
  try {
    await createConnection()
    console.log("DB Connected")
    startSchedularForAllRooms()
  } catch (error) {
    console.log(error)
    throw new Error("DB connection failed")
  }
}
const startApp = async () => {
  await connectToDB()
  const app = express()
  const port = 4000

  app.use(bodyParser.json())
  app.use(cors())
  app.use(addCustomResponse)

  addRoutes(app)

  app.use(handleErrorMiddleware)

  // add all the routes
  const server = addWebSocket(app)
  server.listen(port, () => {
    console.log("app running at port:", port)
  })
}
startApp()
