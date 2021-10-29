import express from "express"
const authRoute = express.Router()

const path = "/ping"

authRoute.get("/", (req, res) => {
  res.send("All good..")
})

export const ping = {
  router: authRoute,
  path,
}
