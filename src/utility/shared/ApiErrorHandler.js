import useToast from "../../hooks/toast"

const ApiErrorHandler = (data, statusCode) => {
  const {toastError} = useToast()
  const { message } = data || {}
  if (message) {
    if (typeof message === "object") {
      toastError(message[0])
    } else {
      toastError(message)
    }
  }
  if (statusCode === 404) {
    toastError("درخواست نامعتبر است")
  }
}

export default ApiErrorHandler
