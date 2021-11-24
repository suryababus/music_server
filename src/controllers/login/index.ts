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
      const resp = await spotify.getMe()
      const {
        body: { display_name, email, id },
      } = resp
      try {
        const user = await User.findOneOrFail(id)
        const userDetails = {
          displayName: display_name,
          id: user.id,
        }
        const token = jwt.sign(userDetails, "heyiamsecret")
        res.sendResponse(200, {
          token,
          user: {
            ...user,
            newUser: false,
          }
        })
      } catch (err) {
        // create new user
        const user = await User.create({
          name: display_name,
          email,
          id,
        }).save()
        const userDetails = {
          displayName: display_name,
          id,
        }
        const token = jwt.sign(userDetails, "heyiamsecret")
        res.sendResponse(200, {
          token,
          user: {
            ...user,
            newUser: true,
          }
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
