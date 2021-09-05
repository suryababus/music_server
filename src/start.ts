import express from "express"
import { addRoutes } from "./routes"
const bodyParser = require("body-parser")
const SpotifyWebApi = require("spotify-web-api-node")
const cors = require("cors")

const app = express()
const port = 4000

app.use(bodyParser.json())
app.use(cors())
addRoutes(app)
app.get("/me", (req, res) => {
  res.send(`This is surya`)
})

app.listen(port, () => {
  console.log("server started at ", port)
})
