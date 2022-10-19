import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Label, Button, Alert } from 'reactstrap'
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import BoxAlert from '@appcomponents/alert/BoxAlert'

const CommentsUpdate = ({ defaultInfo, onUpdated, onCancel }) => {
  const {blog, users, products} = useService()
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const {validate} = useValidator()
  const [isInitialLoaded, setIsInitialLoaded] = useState(false)
  const [state, setState] = useState({
    email: '',
    subject: '',
    message: '',
    status: { label: 'Published', value: 'published' },
    user: null,
    article: null,
    rate: { label: '5', value: 5 },
    successMessage: ''
  })

  const validateFields = async _ => {
    const errs = await validate(state, {
      email: [{name: 'required'}, {name: 'email'}],
      subject: [{name: 'required'}],
      message: [{name: 'required'}],
      user: [{name: 'required'}],
      article: [{name: 'required'}]
    })
    setErrors(errs)
    return errs
  }

  useEffect(() => {
    setIsInitialLoaded(true)
  }, [])

  useEffect(() => {
    try {
      setState({
        email: defaultInfo.email,
        subject: defaultInfo.subject,
        message: defaultInfo.message,
        status: { label: defaultInfo.status.charAt(0).toUpperCase() + defaultInfo.status.slice(1), value: defaultInfo.status },
        user: { label: defaultInfo.user.name + " " + defaultInfo.user.family + ` (${defaultInfo.user.email})`, value: defaultInfo.user._id },
        article: { label: defaultInfo.article.title, value: defaultInfo.article._id },
        rate: { label: defaultInfo.rate.toString(), value: parseInt(defaultInfo.rate.toString()) },
        successMessage: ''
      })
      setErrors({})
    } catch (e) {}
  }, [defaultInfo])

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
      const response = await blog.reviews.update(defaultInfo._id, {
        email: state.email,
        subject: state.subject,
        message: state.message,
        status: state.status.value,
        user: state.user === null ? null : state.user.value,
        article: state.article === null ? null : state.article.value,
        rate: state.rate.value
      })
      onUpdated(response)
      setState({ 
        ...state,
        successMessage: response.data.message.message 
      })
      setErrors({})
    } catch (e) {
      if (e.response.status === 422) {
        const errs = {}
        e.response.data.messages.forEach(item => {
          errs[item.field] = item.message
        })
        setState({ ...state, successMessage: '' })
        setErrors(errs)
      }
    }
  }

  const onHandleUserChange = (selected) => {
    setState({ 
      ...state,
      user: selected
    })
  }

  const loadUsers = async (inputValue, callback) => {
    const response = await users.fetchAll()
    return response.data.data.map(item => {
      return {
        value: item._id,
        label: item.name + " " + item.family + ` (${item.email})`
      }
    })
  }

  const onHandleArticleChange = (selected) => {
    setState({ 
      ...state,
      article: selected
    })
  }

  const loadArticles = async (inputValue, callback) => {
    const response = await blog.fetchAll()
    return response.data.data.map(item => {
      return {
        value: item._id,
        label: item.title
      }
    })
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>Update Comment</span>
            <div className='actions'>
              <Button color='relief-primary' onClick={ onUpdate }>Update</Button>&nbsp;
              <Button color='relief-danger' onClick={ onCancel }>Cancel</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <BoxAlert type='success' visible={state.successMessage !== ''}>
            { state.successMessage }
          </BoxAlert>
          <Row>
            <Col lg='6' md='12'>
              <div className={`mb-2 row select-wrapper ${ errors.user !== undefined ? 'has-error' : '' }`}>
                <Label>User</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  value={state.user}
                  loadOptions={ loadUsers }
                  onChange={ onHandleUserChange }
                />
                <div className="invalid-feedback">{ errors.user !== undefined ? errors.user : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className={`mb-2 row select-wrapper ${ errors.article !== undefined ? 'has-error' : '' }`}>
                <Label>Article</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  value={state.article}
                  loadOptions={ loadArticles }
                  onChange={ onHandleArticleChange }
                />
                <div className="invalid-feedback">{ errors.article !== undefined ? errors.article : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Email</Label>
                <Input placeholder='Email...' value={state.email} onChange={ e => setState({ ...state, email: e.target.value }) } invalid={ errors.email !== undefined } />
                <div className="invalid-feedback">{ errors.email !== undefined ? errors.email : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Subject</Label>
                <Input placeholder='Subject...' value={state.subject} onChange={ e => setState({ ...state, subject: e.target.value }) } invalid={ errors.subject !== undefined } />
                <div className="invalid-feedback">{ errors.subject !== undefined ? errors.subject : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>Message</Label>
                <Input placeholder='Message...' value={state.message} onChange={ e => setState({ ...state, message: e.target.value }) } invalid={ errors.message !== undefined } />
                <div className="invalid-feedback">{ errors.message !== undefined ? errors.message : '' }</div>
              </div>
            </Col>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>Status</Label>
                <Select
                  cacheOptions
                  defaultOptions
                  value={state.status}
                  options={[
                    { label: 'Published', value: 'published' },
                    { label: 'Pending', value: 'pending' }
                  ]}
                  onChange={ selected => setState({ ...state, status: selected }) }
                />
                <div className="invalid-feedback">{ errors.status !== undefined ? errors.status : '' }</div>
              </div>
            </Col>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>Rate</Label>
                <Select
                  cacheOptions
                  defaultOptions
                  value={state.rate}
                  options={[
                    { label: '0', value: 0 },
                    { label: '1', value: 1 },
                    { label: '2', value: 2 },
                    { label: '3', value: 3 },
                    { label: '4', value: 4 },
                    { label: '5', value: 5 }
                  ]}
                  onChange={ selected => setState({ ...state, rate: selected }) }
                />
                <div className="invalid-feedback">{ errors.rate !== undefined ? errors.rate : '' }</div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default CommentsUpdate