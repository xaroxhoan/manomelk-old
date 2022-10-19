import React from "react"
import { Input, Label } from "reactstrap"

function Switch({ checked, handleChange, id, leftEl, rightEl, color, wrapperClassName, ...props }) {
  return (
    <div className={`form-switch form-check-${color} ${wrapperClassName}`}>
      <Input type="switch" id={id} checked={checked} onChange={handleChange} {...props} />
      <Label className="form-check-label" htmlFor={id}>
        <span className="switch-icon-left">{leftEl}</span>
        <span className="switch-icon-right">{rightEl}</span>
      </Label>
    </div>
  )
}

export default Switch
