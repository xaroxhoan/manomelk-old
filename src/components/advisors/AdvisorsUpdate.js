import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Label, Button, Alert } from 'reactstrap'
import Select from 'react-select'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import useToast from '../../hooks/toast'

const AdvisorsUpdate = ({ defaultInfo, onUpdated, onCancel }) => {
  const {advisors} = useService()
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

  useEffect(() => {
    if (defaultInfo === undefined || defaultInfo === null) {
      return
    }
    try {
      setState({
        name: defaultInfo.name,
        family: defaultInfo.family,
        mobile: defaultInfo.mobile,
        status: { label: (defaultInfo.status === "active" ? "تایید شده" : "مسدود"), value: defaultInfo.status }
      })
      setErrors({})
    } catch (e) {}
  }, [defaultInfo])

  const validateFields = async _ => {
    const errs = await validate(state, {
      name: [{name: 'required'}],
      family: [{name: 'required'}],
      mobile: [{name: 'required'}, {name: 'unique', model: 'User', conditions: {mobile: state.mobile}, exceptIds: [defaultInfo._id]}]
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
      const response = await advisors.update(defaultInfo._id, {
        name: state.name,
        family: state.family,
        mobile: state.mobile,
        status: state.status.value
      })
      onUpdated(response)
      setErrors({})
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
            <span>ویرایش مشاور املاک</span>
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

export default AdvisorsUpdate