import { Modal, ModalHeader, ModalBody, Spinner } from "reactstrap"

export default function CustomModal({ children, title, isOpen, onToggle, loading, size = "lg", ...props }) {
  return (
    <Modal isOpen={isOpen} toggle={onToggle} size={size} {...props}>
      <ModalHeader className="bg-transparent" toggle={onToggle} />
      <ModalBody className="px-sm-5 mx-50 pb-4">
        <h1 className="text-center mb-1"> {title}</h1>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner />
          </div>
        ) : (
          children
        )}
      </ModalBody>
    </Modal>
  )
}
