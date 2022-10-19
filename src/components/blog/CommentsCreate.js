import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Label, Button, Alert } from 'reactstrap'
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import BoxAlert from '@appcomponents/alert/BoxAlert'

const CommentsCreate = ({ onSaved, onCancel }) => {
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const {blog, users} = useService()
  const {validate} = useValidator()
  const [isSaveClicked, setIsSaveClicked] = useState(false)
  const [state, setState] = useState({
    email: '',
    subject: '',
    message: '',
    status: { label: 'Approved', value: 'approved' },
    user: null,
    article: null,
    rate: { label: '5', value: 5 },
    errors: {},
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

  useEffect(async () => {
    if (isSaveClicked) {
      await validateFields()
    }
  }, [state])

  const onSave = async () => {
    try {
      if (!state.isSaveClicked) {
        setIsSaveClicked(true)
      }
      const formErrors = await validateFields()
      if (Object.keys(formErrors).length > 0) {
        return
      }
      const response = await blog.reviews.store({
        email: state.email,
        subject: state.subject,
        message: state.message,
        status: state.status.value,
        user: state.user === null ? null : state.user.value,
        article: state.article === null ? null : state.article.value,
        rate: state.rate.value
      })
      onSaved(response)
      setErrors({})
      setIsSaveClicked(false)
      setState({ 
        email: '',
        subject: '',
        message: '',
        status: { label: 'Approved', value: 'approved' },
        user: null,
        article: null,
        rate: { label: '5', value: 5 },
        successMessage: response.data.message.message 
      })
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
        label: `${item.name} ${item.family} (${item.email})`
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
            <span>Create Article Review</span>
            <div className='actions'>
              <Button color='relief-primary' onClick={ onSave }>Save</Button>&nbsp;
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
                    { label: 'Approved', value: 'approved' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Rejected', value: 'rejected' }
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

export default CommentsCreate