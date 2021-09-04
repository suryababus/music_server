const express = require("express")
const authRoute = express.Router()

authRoute.get("/", (req, res) => {
  res.send("this is login")
})

module.exports = authRoute
