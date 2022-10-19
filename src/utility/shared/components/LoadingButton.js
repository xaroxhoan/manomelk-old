import { Button, Spinner } from "reactstrap"

const LoadingButton = ({ children, loading, disabled, className, ...props }) => {
  return (
    <Button className={className} disabled={loading || disabled} {...props}>
      {children}
      {loading && <Spinner size="sm" className="ms-50" />}
    </Button>
  )
}

export default LoadingButton
