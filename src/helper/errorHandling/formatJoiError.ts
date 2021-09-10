type errorType = {
  message: String
  field: String
}
export const formatJoiError = ({
  details: [
    {
      message,
      context: { label },
    },
  ],
}: any): errorType => ({
  message: (message as string).replace(/[^\w\s]/gi, ""),
  field: label,
})
