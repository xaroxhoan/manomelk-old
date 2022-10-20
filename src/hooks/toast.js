import { toast, Slide } from "react-toastify"

const ToastContent = ({ title }) => (
    <>
      <div className="toastify-header">
        <div className="title-wrapper">
          <h6 className="toast-title fw-bold">{title}</h6>
        </div>
      </div>
    </>
)

const useToast = () => {
    const toastSuccess = (title) => {
        toast.success(<ToastContent title={title} />, {
            position: "top-center",
            icon: false,
            transition: Slide,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            autoClose: 2000
        })
    }
    const toastError = (title) => {
        toast.error(<ToastContent title={title} />, {
            position: "top-center",
            icon: false,
            transition: Slide,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            autoClose: 2000
        })
    }
    return {
        toastError,
        toastSuccess
    }
}
export default useToast