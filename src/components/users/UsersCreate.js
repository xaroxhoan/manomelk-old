import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Label, Button, Alert } from 'reactstrap'
import Select from 'react-select'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import useToast from '../../hooks/toast'

const UsersCreate = ({ onSaved, onCancel }) => {
  const {users} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const [isSaveClicked, setIsSaveClicked] = useState(false)
  const [state, setState] = useState({
    name: '',
    family: '',
    mobile: '',
    status: { label: 'تایید شده', value: 'active' }
  })
  const {toastError, toastSuccess} = useToast()

  const validateFields = async _ => {
    const errs = await validate(state, {
      name: [{name: 'required'}],
      family: [{name: 'required'}],
      mobile: [{name: 'required'}, {name: 'unique', model: 'User', conditions: {mobile: state.mobile}, exceptIds: []}]
    })
    setErrors(errs)
    return errs
  }

  useEffect(async () => {
    if (isSaveClicked) {
      await validateFields()
    }
  }, [state])

  const onSave = async () => {
    if (!isSaveClicked) {
      setIsSaveClicked(true)
    }
    const formErrors = await validateFields()
    if (Object.keys(formErrors).length > 0) {
      return
    }
    try {
      const response = await users.store({
        name: state.name,
        family: state.family,
        mobile: state.mobile,
        status: state.status.value
      })
      onSaved(response)
      setErrors({})
      setIsSaveClicked(false)
      setState({
        ...state,
        name: '',
        family: '',
        mobile: '',
        status: { label: 'تایید شده', value: 'active' }
      })
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

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>آگهی دهنده جدید</span>
            <div className='actions'>
              <Button color='relief-primary' onClick={ onSave }>ثبت</Button>&nbsp;
              <Button color='relief-danger' onClick={ onCancel }>انصراف</Button>
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
        </CardBody>
      </Card>
    </div>
  )
}

export default UsersCreate