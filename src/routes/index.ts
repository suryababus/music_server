import { authenticate } from "./authenticate"
import { rooms } from "./rooms"
import { reaction } from "./reaction"

export const routes = [authenticate, rooms, reaction]

export const addRoutes = (app: any) => {
  routes.forEach((route) => {
    app.use(route.path, route.router)
  })
}
