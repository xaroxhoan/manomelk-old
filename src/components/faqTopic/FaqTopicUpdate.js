import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Label, Button, Alert } from 'reactstrap'
import Select from 'react-select'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import useToast from '../../hooks/toast'

const FaqTopicUpdate = ({ defaultInfo, onUpdated, onCancel }) => {
  const {faqtopic} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const [isInitialLoaded, setIsInitialLoaded] = useState(false)
  const [state, setState] = useState({
    title: '',
    sort: 0,
    status: { label: 'فعال', value: 'enabled' }
  })
  const {toastError, toastSuccess} = useToast()

  useEffect(() => {
    if (defaultInfo === null) {
      return
    }
    try {
      setState({
        ...state,
        title: defaultInfo.title,
        sort: defaultInfo.sort,
        status: { label: (defaultInfo.status === "enabled" ? "فعال" : "غیرفعال"), value: defaultInfo.status }
      })
      setErrors({})
    } catch (e) {}
  }, [defaultInfo])

  const validateFields = async _ => {
    const errs = await validate(state, {
      title: [{name: 'required'}],
      sort: [{name: 'required'}, {name: 'number'}]
    })
    setErrors(errs)
    return errs
  }

  useEffect(() => {
    setIsInitialLoaded(true)
  }, [])

  useEffect(async () => {
    if (isInitialLoaded) {
      await validateFields()
    }
  }, [state])

  const onUpdate = async () => {
    try {
      const formErrors = await validateFields()
      if (Object.keys(formErrors).length > 0) {
        return
      }
      const response = await faqtopic.update(defaultInfo._id, {
        title: state.title,
        sort: state.sort,
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
            <span>ویرایش گروه</span>
            <div className='actions'>
              <Button color='relief-primary' onClick={ onUpdate }>ویرایش</Button>&nbsp;
              <Button color='relief-danger' onClick={ onCancel }>لغو</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>عنوان</Label>
                <Input placeholder='عنوان...' value={state.title} onChange={ e => setState({ ...state, title: e.target.value }) } invalid={ errors.title !== undefined } />
                <div className="invalid-feedback">{ errors.title !== undefined ? errors.title : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>اولویت</Label>
                <Input placeholder='اولویت...' value={state.sort} onChange={ e => setState({ ...state, sort: e.target.value }) } invalid={ errors.sort !== undefined } />
                <div className="invalid-feedback">{ errors.sort !== undefined ? errors.sort : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>وضعیت</Label>
                <Select
                  cacheOptions
                  defaultOptions
                  value={state.status}
                  options={[
                    { label: 'فعال', value: 'enabled' },
                    { label: 'غیرفعال', value: 'disabled' }
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

export default FaqTopicUpdate