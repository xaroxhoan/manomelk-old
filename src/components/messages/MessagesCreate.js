import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Label, Button, Alert } from 'reactstrap'
import UploaderModal from '../upload/UploaderModal'
import Select from 'react-select'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import AsyncSelect from 'react-select/async'
import BoxAlert from '@appcomponents/alert/BoxAlert'

const MessagesCreate = ({ onSaved, onCancel }) => {
  const {messages, users} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const [isSaveClicked, setIsSaveClicked] = useState(false)
  const [state, setState] = useState({
    user: null,
    subject: '',
    description: '',
    successMessage: ''
  })

  const validateFields = async _ => {
    const errs = await validate(state, {
      user: [{name: 'required'}],
      subject: [{name: 'required'}],
      description: [{name: 'required'}]
    })
    setErrors(errs)
    return errs
  }

  useEffect(async () => {
    if (isSaveClicked) {
      await validateFields()
    }
  }, [state.user, state.subject, state.description])

  const onSave = async () => {
    try {
      if (!state.isSaveClicked) {
        setIsSaveClicked(true)
      }
      const formErrors = await validateFields()
      if (Object.keys(formErrors).length > 0) {
        return
      }
      const response = await messages.store({
        user: state.user !== null ? state.user.value : null,
        subject: state.subject,
        description: state.description
      })
      onSaved(response)
      setErrors({})
      setIsSaveClicked(false)
      setState({ 
        user: null,
        subject: "",
        description: "",
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
    const response = await users.fetchCustomersAndAdmins()
    const options = response.data.data.map(item => {
      return {
        value: item._id,
        label: item.name + " " + item.family + ` (${item.email})`
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
            <span>Send New Message</span>
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
            <Col lg='12' md='12'>
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
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Subject</Label>
                <Input placeholder='Subject...' value={state.subject} onChange={ e => setState({ ...state, subject: e.target.value }) } invalid={ errors.subject !== undefined } />
                <div className="invalid-feedback">{ errors.subject !== undefined ? errors.subject : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Message</Label>
                <Input placeholder='Message...' value={state.description} onChange={ e => setState({ ...state, description: e.target.value }) } invalid={ errors.description !== undefined } />
                <div className="invalid-feedback">{ errors.description !== undefined ? errors.description : '' }</div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default MessagesCreate