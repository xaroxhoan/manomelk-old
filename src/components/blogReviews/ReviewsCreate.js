import { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, CardTitle, Input, Label, Row, Col, Button } from 'reactstrap'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import useToast from '../../hooks/toast'

const ReviewsCreate = ({ onSaved, onCancel }) => {
  const service = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const [isSaveClicked, setIsSaveClicked] = useState(false)
  const [state, setState] = useState({
    name: "",
    family: "",
    email: "",
    subject: "",
    blog: null,
    text: "",
    status: { label: 'فعال', value: 'enabled' }
  })
  const {toastError, toastSuccess} = useToast()

  const validateFields = async _ => {
    const errs = await validate(state, {
      name: [{name: 'required'}],
      family: [{name: 'required'}],
      email: [{name: 'required'}, {name: 'email'}],
      subject: [{name: 'required'}],
      blog: [{name: 'required'}],
      text: [{name: 'required'}]
    })
    setErrors(errs)
    return errs
  }

  useEffect(async () => {
    if (isSaveClicked) {
      await validateFields()
    }
  }, [
    state.name,
    state.family,
    state.email,
    state.subject,
    state.blog,
    state.text
  ])

  const onSave = async () => {
    try {
      if (!state.isSaveClicked) {
        setIsSaveClicked(true)
      }
      const formErrors = await validateFields()
      if (Object.keys(formErrors).length > 0) {
        return
      }
      const response = await service.blog.reviews.store({
        name: state.name,
        family: state.family,
        email: state.email,
        subject: state.subject,
        blog: state.blog !== null ? state.blog.value : null,
        text: state.text,
        status: state.status.value
      })
      if (response.data.statusCode === 200) {
        onSaved(response)
        setErrors({})
        setIsSaveClicked(false)
        setState({ 
          ...state,
          name: "",
          family: "",
          email: "",
          subject: "",
          blog: null,
          text: "",
          status: { label: 'فعال', value: 'enabled' }
        })
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

  const onHandleBlogChange = (value) => {
    setState({ 
      ...state,
      blog: value
    })
  }

  const loadBlogs = async (inputValue, callback) => {
    const response = await service.blog.fetchAll()
    let options = response.data.result.map(item => {
      return {
        value: item._id,
        label: item.title
      }
    })
    if (inputValue !== '') {
      options = options.filter(item => item.label.toLowerCase().includes(inputValue.toLowerCase()))
    }
    return options
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>نظر جدید</span>
            <div className='actions'>
              <Button color='relief-primary' onClick={ onSave }>ثبت</Button>&nbsp;
              <Button color='relief-danger' onClick={ onCancel }>لغو</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg='12' md='12'>
              <div className={`mb-2 row select-wrapper ${ errors.blog !== undefined ? 'has-error' : '' }`}>
                  <Label>مقاله</Label>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    placeholder="مقاله"
                    loadOptions={ loadBlogs }
                    value={state.blog}
                    onChange={ onHandleBlogChange }
                  />
                  <div className="invalid-feedback">{ errors.blog !== undefined ? errors.blog : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>نام</Label>
                <Input placeholder='نام...' value={state.name} onChange={ e => setState({ ...state, name: e.target.value }) } invalid={ errors.name !== undefined } />
                <div className="invalid-feedback">{ errors.name !== undefined ? errors.name : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>نام خانوادگی</Label>
                <Input placeholder='نام خانوادگی...' value={state.family} onChange={ e => setState({ ...state, family: e.target.value }) } invalid={ errors.family !== undefined } />
                <div className="invalid-feedback">{ errors.family !== undefined ? errors.family : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>ایمیل</Label>
                <Input placeholder='ایمیل...' value={state.email} onChange={ e => setState({ ...state, email: e.target.value }) } invalid={ errors.email !== undefined } />
                <div className="invalid-feedback">{ errors.email !== undefined ? errors.email : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>موضوع</Label>
                <Input placeholder='موضوع...' value={state.subject} onChange={ e => setState({ ...state, subject: e.target.value }) } invalid={ errors.subject !== undefined } />
                <div className="invalid-feedback">{ errors.subject !== undefined ? errors.subject : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12}>
              <div className='mb-2'>
                <Label>متن</Label>
                <Input type={"textarea"} placeholder='متن...' value={state.text} onChange={ e => setState({ ...state, text: e.target.value }) } invalid={ errors.text !== undefined } />
                <div className="invalid-feedback">{ errors.text !== undefined ? errors.text : '' }</div>
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

export default ReviewsCreate
