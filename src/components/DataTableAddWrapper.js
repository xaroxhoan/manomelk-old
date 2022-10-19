import { Button, Col } from "reactstrap"

const DataTableAddWrapper = ({ title, onClick }) => {
    return (
        <Col lg={12} className="add-wrapper">
          <strong>Add {title}</strong>
          <span>Get started by adding your first {title}</span>
          <Button color="relief-primary" onClick={onClick}>Create {title}</Button>
        </Col>
    )
}

export default DataTableAddWrapper