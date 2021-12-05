import express from "express"
import { authenticate } from "../middlewares/authenticate"
const authRoute = express.Router()

const path = "/ping"

authRoute.use(authenticate)

authRoute.get("/", (req, res) => {
  res.sendResponse(200,"All good..")
})

export const ping = {
  router: authRoute,
  path,
}
