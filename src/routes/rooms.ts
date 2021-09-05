import express from "express"
import { authenticate } from "../middlewares/authenticate"
const authRoute = express.Router()

const path = "/rooms"
authRoute.use(authenticate)

authRoute.get("/:id", (req, res) => {
  res.send(`this is rooms ${req.params.id}`)
})

export const rooms = {
  router: authRoute,
  path,
}
