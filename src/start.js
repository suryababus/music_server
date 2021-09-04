const express = require("express")
const bodyParser = require("body-parser")
const SpotifyWebApi = require("spotify-web-api-node")
const cors = require("cors")
const authRoute = require("./routes/authenticate")

const app = express()
const port = 4000

app.use(bodyParser.json())
app.use(cors())
app.use("/auth", authRoute)
app.use("/rooms", authRoute)

app.get("/me", (req, res) => {
  res.send("This is surya")
})

app.listen(port, () => {
  console.log("server started at ", port)
})
