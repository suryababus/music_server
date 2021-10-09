export const event = "text_message"
export const handler = (userId: string, message: any, ws: WebSocket) => {
  console.log(`handler: user:${userId} message:${message.data}`)
}
