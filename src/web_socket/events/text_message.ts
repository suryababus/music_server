export const event = "text_message"
import { userRoomWS } from "."
import { log } from "../../helper/logger/index"
import { publishAction } from "../actions/actions"
import { actions } from "../actions/actionsEnum"

export const handler = (userId: string,userName:string, message: any, ws: WebSocket) => {
  log(`handler: user:${userId} message:${message.data}`)
  var roomws = userRoomWS[userId];
  const data = {
    user_name: userName,
    message: message.data,
    user_id: userId
  }
  publishAction(roomws.roomId,actions.TEXT_MESSAGE,data)
}
