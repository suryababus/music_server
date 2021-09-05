import { authenticate } from "./authenticate"
import { rooms } from "./rooms"

export const routes = [authenticate, rooms]

export const addRoutes = (app: any) => {
  routes.forEach((route) => {
    app.use(route.path, route.router)
  })
}
