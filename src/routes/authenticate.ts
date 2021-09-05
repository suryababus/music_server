import express from "express"
const authRoute = express.Router()

const path = "/auth"

authRoute.get("/", (req, res) => {
  res.send("this is login babu")
})

export const authenticate = {
  router: authRoute,
  path,
}
