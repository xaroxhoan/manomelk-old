import { Input, Label } from "reactstrap"

const SwitchBox = ({ id, title, description, defaultChecked }) => {
    return (
        <div className="two-line-checkbox-wrapper">
            <Label for={id}>
                <strong>{title}</strong>
                <small>{description}</small>
            </Label>
            <div className='d-flex flex-column'>
                <div className='form-switch form-check-primary'>
                    <Input type='switch' id={id} name='primary' defaultChecked={defaultChecked} />
                </div>
            </div>
        </div>
    )
}

export default SwitchBox