export const event = "sync"
export const handler = (userId: string, message: any, ws: WebSocket) => {
  console.log(`handler: user:${userId} message:${message.data}`)
  ws.send(
    JSON.stringify({
      action: "sync",
      data: "",
    })
  )
}
