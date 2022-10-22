import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Label, Button } from 'reactstrap'
import Select from 'react-select'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import useToast from '../../hooks/toast'

const TarrifsUpdate = ({ defaultInfo, onUpdated, onCancel }) => {
  const {tarrifs} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const [isInitialLoaded, setIsInitialLoaded] = useState(false)
  const [state, setState] = useState({
    title: '',
    canUseAdvancedSearch: false,
    canSeeContactInfo: false,
    canSeeCreatorsPerArea: false,
    price: 1000,
    days: 30,
    status: { label: 'فعال', value: 'enabled' },
    updateCounter: 0
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
        canUseAdvancedSearch: defaultInfo.canUseAdvancedSearch,
        canSeeContactInfo: defaultInfo.canSeeContactInfo,
        canSeeCreatorsPerArea: defaultInfo.canSeeCreatorsPerArea,
        price: defaultInfo.price,
        days: defaultInfo.days,
        updateCounter: 0,
        status: { label: (defaultInfo.status === "enabled" ? "فعال" : "غیرفعال"), value: defaultInfo.status }
      })
      setErrors({})
    } catch (e) {}
  }, [defaultInfo])

  const validateFields = async _ => {
    const errs = await validate(state, {
      title: [{name: 'required'}],
      price: [{name: 'required'}, {name: 'number', min: defaultInfo.isFree === true ? 0 : 1000}],
      days: [{name: 'required'}, {name: 'number', min: 1}]
    })
    setErrors({...errs})
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
      const response = await tarrifs.update(defaultInfo._id, {
        title: state.title,
        canUseAdvancedSearch: state.canUseAdvancedSearch,
        canSeeContactInfo: state.canSeeContactInfo,
        canSeeCreatorsPerArea: state.canSeeCreatorsPerArea,
        price: parseInt(state.price),
        days: parseInt(state.days),
        status: state.status.value
      })
      if (response.data.statusCode === 200) {
        onUpdated(response)
        setErrors({})
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
            <span>ویرایش تعرفه</span>
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
          {defaultInfo.isFree === false && <><Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>مبلغ (تومان)</Label>
                <Input placeholder='مبلغ (تومان)...' value={state.price} onChange={ e => setState({ ...state, price: e.target.value }) } invalid={ errors.price !== undefined } />
                <div className="invalid-feedback">{ errors.price !== undefined ? errors.price : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>تعداد روز</Label>
                <Input placeholder='تعداد روز...' value={state.days} onChange={ e => setState({ ...state, days: e.target.value }) } invalid={ errors.days !== undefined } />
                <div className="invalid-feedback">{ errors.days !== undefined ? errors.days : '' }</div>
              </div>
            </Col>
          </Row></>}
          <Row>
            <Col lg='12' md='12'>
            <div className='mb-2'>
                <Label>ویژگی ها</Label>
                <div className='mb-15'>
                  <div className="demo-inline-spacing">
                    <div className="form-check form-check-inline">
                      <Input
                        id={"tarrif1"}
                        type="checkbox" 
                        className="form-check-input" 
                        onChange={e => setState({...state, canUseAdvancedSearch: e.target.value === "on"})}
                        value={state.canUseAdvancedSearch === true ? 'off' : 'on'}
                        checked={state.canUseAdvancedSearch === true} />
                      <Label for={"tarrif1"} className="form-check-label form-label">نمایش جستجوی پیشرفته</Label>
                    </div>
                  </div>
                  <div className="invalid-feedback">{ errors.canUseAdvancedSearch !== undefined ? errors.canUseAdvancedSearch : '' }</div>
                </div>
                <div className='mb-15'>
                  <div className="form-check form-check-inline">
                    <Input
                      id={"tarrif2"}
                      type="checkbox" 
                      className="form-check-input" 
                      onChange={e => setState({...state, canSeeContactInfo: e.target.value === "on"})}
                      value={state.canSeeContactInfo === true ? 'off' : 'on'}
                      checked={state.canSeeContactInfo === true} />
                    <Label for={"tarrif2"} className="form-check-label form-label">نمایش اطلاعات تماس آگهی دهنده</Label>
                  </div>
                  <div className="invalid-feedback">{ errors.canSeeContactInfo !== undefined ? errors.canSeeContactInfo : '' }</div>
                </div>
                <div className='mb-15'>
                  <div className="form-check form-check-inline">
                    <Input
                      id={"tarrif3"}
                      type="checkbox" 
                      className="form-check-input" 
                      onChange={e => setState({...state, canSeeCreatorsPerArea: e.target.value === "on"})}
                      value={state.canSeeCreatorsPerArea === true ? 'off' : 'on'}
                      checked={state.canSeeCreatorsPerArea === true} />
                    <Label for={"tarrif3"} className="form-check-label form-label">نمایش اطلاعات سازندگان</Label>
                  </div>
                  <div className="invalid-feedback">{ errors.canSeeCreatorsPerArea !== undefined ? errors.canSeeCreatorsPerArea : '' }</div>
                </div>
              </div>
            </Col>
          </Row>
          {defaultInfo.isFree !== true ? <Row>
            <Col lg='6' md='12'>
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
          </Row> : undefined}
        </CardBody>
      </Card>
    </div>
  )
}

export default TarrifsUpdate