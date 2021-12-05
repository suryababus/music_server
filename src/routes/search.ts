import express from "express"
import { authenticate } from "../middlewares/authenticate"
import {searchDetails} from "../controllers/search"
const authRoute = express.Router()

const path = "/search"
authRoute.use(authenticate)

authRoute.get("/", searchDetails)

export const search = {
  router: authRoute,
  path,
}
