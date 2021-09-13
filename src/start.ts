import express, { ErrorRequestHandler, NextFunction, Response } from "express"
import "reflect-metadata"
import { createConnection } from "typeorm"
import { addRoutes } from "./routes"
import { addCustomResponse } from "./middlewares/addCustomResponse"
import { handleErrorMiddleware } from "./middlewares/handleErrorMiddleware"

process.on("uncaughtException", (err) => {
  console.log(err)
})

const bodyParser = require("body-parser")
const cors = require("cors")

const connectToDB = async () => {
  try {
    await createConnection()
    console.log("DB Connected")
  } catch (error) {
    new Error("DB connection failed")
  }
}
connectToDB()

const app = express()
const port = 4000

app.use(bodyParser.json())
app.use(cors())
app.use(addCustomResponse)

// add all the routes
addRoutes(app)

app.use(handleErrorMiddleware)

app.listen(port, () => {
  console.log("app running at port:", port)
})