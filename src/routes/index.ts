import { authenticate } from "./authenticate"
import { rooms } from "./rooms"
import { reaction } from "./reaction"
import { ping } from "./ping"
import { search } from "./search"
import { songs } from "./songs"

export const routes = [authenticate, rooms, songs, reaction, ping, search]

export const addRoutes = (app: any) => {
  routes.forEach((route) => {
    app.use(route.path, route.router)
  })
}
