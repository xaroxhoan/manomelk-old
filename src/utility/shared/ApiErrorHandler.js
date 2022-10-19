import { Alert } from "reactstrap"
import { AlertCircle } from "react-feather"
import { notify } from "../Utils"
import swal from "sweetalert2/dist/sweetalert2.all.min.js"
import withReactContent from "sweetalert2-react-content"

function ApiErrorHandler(data, statusCode) {
  const MySwal = withReactContent(swal)

  const { message, messages } = data || {}
  console.log(message, messages)
  if (message) {
    notify("error", message.message)
  }
  if (messages?.length > 0) {
    const errorMassages = messages.map(m => m.message)
    notify("error", errorMassages[0])
    MySwal.fire({
      html: (
        <Alert color="danger">
          {errorMassages.map((msg, i) => (
            <div className="alert-body text-start" key={i}>
              <AlertCircle size={15} />
              <span className="ms-1">{msg}</span>
            </div>
          ))}
        </Alert>
      ),
      icon: "error",
      confirmButtonText: "close",
      customClass: {
        confirmButton: "btn btn-primary"
      },
      buttonsStyling: false
    })
  }
  if (statusCode === 404) {
    notify("error", "invalid request")
  }
}

export default ApiErrorHandler
