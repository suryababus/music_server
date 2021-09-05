export const authenticate = (req: any, res: any, next: any) => {
  console.log(req)
  if (req.query.auth == "surya") {
    next()
  } else {
    res.send("auth error")
  }
}
