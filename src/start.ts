import express, { ErrorRequestHandler, NextFunction, Response } from "express"
import "reflect-metadata"
import { createConnection } from "typeorm"
import { addRoutes } from "./routes"
import { addCustomResponse } from "./middlewares/addCustomResponse"
import { handleErrorMiddleware } from "./middlewares/handleErrorMiddleware"
import { addWebSocket } from "./web_socket"
import { log } from "./helper/logger/index"

process.on("uncaughtException", (err) => {
  log(err);
})

const bodyParser = require("body-parser")
const cors = require("cors")

const connectToDB = async () => {
  try {
    await createConnection()
    log("DB Connected");
  } catch (error) {
    log(error);
    throw new Error("DB connection failed")
  }
}
connectToDB()

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
  log("app running at port : "+port);
})
