const express = require("express")
const authRoute = express.Router()

authRoute.get("/:id", (req, res) => {
  res.send("this is rooms")
})

module.exports = authRoute
