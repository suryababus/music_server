import { RequestHandler } from "express"
import SpotifyWebApi from "spotify-web-api-node"
import { User } from "../../entities/user"
import { LoginInput } from "./schema"
import jwt from "jsonwebtoken"
const spotify = new SpotifyWebApi()

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { token } = await LoginInput.validateAsync(req.body)
    spotify.setAccessToken(token)
    try {
      const {
        body: { display_name, email, id },
      } = await spotify.getMe()
      try {
        const user = await User.findOneOrFail(id)
        const token = jwt.sign(user.id, "heyiamsecret")
        res.sendResponse(200, {
          token,
        })
      } catch (err) {
        // create new user
        const user = await User.create({
          name: display_name,
          email,
          id,
        }).save()
        const token = jwt.sign(user.id, "heyiamsecret")
        res.sendResponse(200, {
          token,
          newUser: true,
        })
        return
      }
    } catch (err) {
      res.sendError(401, "invalid token")
      return
    }
  } catch (err) {
    next(err)
    return
  }
}
