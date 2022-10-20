import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Label, Button, Alert } from 'reactstrap'
import Select from 'react-select'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import { PermissionPersianTitle, Permissions } from '../../hooks/Acl'
import useToast from '../../hooks/toast'

const OperatorsUpdate = ({ defaultInfo, onUpdated, onCancel }) => {
  const {operators} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const [isSaveClicked, setIsSaveClicked] = useState(false)
  const [state, setState] = useState({
    name: '',
    family: '',
    email: '',
    mobile: '',
    password: '',
    selectedPermissions: [],
    status: { label: 'Approved', value: 'approved' }
  })
  const {toastError, toastSuccess} = useToast()

  useEffect(() => {
    if (defaultInfo === undefined || defaultInfo === null) {
      return
    }
    try {
      setState({
        name: defaultInfo.name,
        family: defaultInfo.family,
        email: defaultInfo.email,
        mobile: defaultInfo.mobile,
        selectedPermissions: defaultInfo.permissions === undefined || defaultInfo.permissions === null ? [] : defaultInfo.permissions,
        status: { label: (defaultInfo.status === "active" ? "تایید شده" : "مسدود"), value: defaultInfo.status }
      })
      setErrors({})
    } catch (e) {}
  }, [defaultInfo])

  const validateFields = async _ => {
    const errs = await validate(state, {
      name: [{name: 'required'}],
      family: [{name: 'required'}],
      email: [{name: 'required'}, {name: 'email'}, {name: 'unique', model: 'User', conditions: {email: state.email}, exceptIds: [defaultInfo._id]}],
      mobile: [{name: 'required'}]
    })
    setErrors(errs)
    return errs
  }

  useEffect(async () => {
    if (isSaveClicked) {
      await validateFields()
    }
  }, [state])

  const onUpdate = async () => {
    if (!isSaveClicked) {
      setIsSaveClicked(true)
    }
    const formErrors = await validateFields()
    if (Object.keys(formErrors).length > 0) {
      return
    }
    try {
      const response = await operators.update(defaultInfo._id, {
        name: state.name,
        family: state.family,
        email: state.email,
        mobile: state.mobile,
        password: state.password,
        status: state.status.value,
        selectedPermissions: state.selectedPermissions
      })
      onUpdated(response)
      setErrors({})
      setIsSaveClicked(false)
      if (response.data.statusCode === 200) {
        toastSuccess("تغییرات با موفقیت ثبت گردید")
      } else {
        toastError(response.data.message)
      }
    } catch (e) {
      if (e.response.status === 400) {
        toastError(e.response.data.message[0])
      }
    }
  }

  const findCheckboxIndex = (action, resource) => {
    return state.selectedPermissions.findIndex(item => {
      return (item.resource === resource && 
        item.action === action)
    })
  }

  const onChange = (e, permissionParent, permissionChild) => {
    const value = e.target.value
    const action = Permissions[permissionParent][permissionChild].action
    const resource = Permissions[permissionParent][permissionChild].resource
    const index = findCheckboxIndex(action, resource)
    let tempSelectedPermissions = [...state.selectedPermissions]
    if (value === 'off') {
      tempSelectedPermissions.splice(index, 1)
    } else {
      tempSelectedPermissions = [
        ...tempSelectedPermissions,
        { action, resource }
      ]
    }
    setState({...state, selectedPermissions: tempSelectedPermissions})
  }

  const isCheckboxChecked = (action, resource) => {
    return findCheckboxIndex(action, resource) > -1
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>ویرایش کاربر</span>
            <div className='actions'>
              <Button color='relief-primary' onClick={ onUpdate }>ویرایش</Button>&nbsp;
              <Button color='relief-danger' onClick={ onCancel }>لغو</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
        <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>نام</Label>
                <Input placeholder='نام...' autoComplete='off' value={state.name} onChange={ e => setState({ ...state, name: e.target.value }) } invalid={ errors.name !== undefined } />
                <div className="invalid-feedback">{ errors.name !== undefined ? errors.name : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>نام خانوادگی</Label>
                <Input placeholder='نام خانوادگی...' autoComplete='off' value={state.family} onChange={ e => setState({ ...state, family: e.target.value }) } invalid={ errors.family !== undefined } />
                <div className="invalid-feedback">{ errors.family !== undefined ? errors.family : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>تلفن همراه</Label>
                <Input placeholder='تلفن همراه...' autoComplete='off' value={state.mobile} onChange={ e => setState({ ...state, mobile: e.target.value }) } invalid={ errors.mobile !== undefined } />
                <div className="invalid-feedback">{ errors.mobile !== undefined ? errors.mobile : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>ایمیل</Label>
                <Input placeholder='ایمیل...' autoComplete='off' value={state.email} onChange={ e => setState({ ...state, email: e.target.value }) } invalid={ errors.email !== undefined } />
                <div className="invalid-feedback">{ errors.email !== undefined ? errors.email : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>رمز عبور</Label>
                <Input type='password' autoComplete='off' placeholder='رمز عبور...' value={state.password} onChange={ e => setState({ ...state, password: e.target.value }) } invalid={ errors.password !== undefined } />
                <div className="invalid-feedback">{ errors.password !== undefined ? errors.password : '' }</div>
              </div>
            </Col>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>وضعیت</Label>
                <Select
                  cacheOptions
                  defaultOptions
                  value={state.status}
                  options={[
                    { label: 'تایید شده', value: 'active' },
                    { label: 'مسدود', value: 'banned' }
                  ]}
                  onChange={ selected => setState({ ...state, status: selected }) }
                />
                <div className="invalid-feedback">{ errors.status !== undefined ? errors.status : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>مجوزهای دسترسی</Label>
                <div className="demo-inline-spacing">
                  {[...Object.keys(Permissions)].map(permissionParent => {
                    return [...Object.keys(Permissions[permissionParent])].map(permissionChild => {
                      return <div key={permissionParent + permissionChild} className="form-check form-check-inline">
                        <Input 
                          id={permissionParent + permissionChild}
                          type="checkbox" 
                          className="form-check-input" 
                          onChange={e => onChange(e, permissionParent, permissionChild)}
                          value={isCheckboxChecked(Permissions[permissionParent][permissionChild].action, Permissions[permissionParent][permissionChild].resource) ? 'off' : 'on'}
                          checked={isCheckboxChecked(Permissions[permissionParent][permissionChild].action, Permissions[permissionParent][permissionChild].resource)} />
                        <Label for={permissionParent + permissionChild} className="form-check-label form-label">{PermissionPersianTitle(permissionParent, permissionChild)}</Label>
                      </div>
                    })
                  })}
                </div>
                <div className="invalid-feedback">{ errors.permissions !== undefined ? errors.permissions : '' }</div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default OperatorsUpdate