import { authenticate } from "./authenticate"
import { rooms } from "./rooms"
import { reaction } from "./reaction"
import { ping } from "./ping"
import { search } from "./search"

export const routes = [authenticate, rooms, reaction, ping, search]

export const addRoutes = (app: any) => {
  routes.forEach((route) => {
    app.use(route.path, route.router)
  })
}
