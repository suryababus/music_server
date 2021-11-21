import express from "express"
import { authenticate } from "../middlewares/authenticate"
import {searchDetails} from "../controllers/search"
const authRoute = express.Router()

const path = "/global"
authRoute.use(authenticate)

authRoute.get("/search", searchDetails)

export const search = {
  router: authRoute,
  path,
}
