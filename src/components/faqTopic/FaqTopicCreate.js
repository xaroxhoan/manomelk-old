import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Label, Button, Alert } from 'reactstrap'
import Select from 'react-select'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import BoxAlert from '@appcomponents/alert/BoxAlert'

const FaqTopicCreate = ({ onSaved, onCancel }) => {
  const {faqtopic} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const [isSaveClicked, setIsSaveClicked] = useState(false)
  const [state, setState] = useState({
    title: '',
    alias: '',
    sort: 0,
    status: { label: 'Enabled', value: 'enabled' },
    successMessage: ''
  })

  const validateFields = async _ => {
    const errs = await validate(state, {
      title: [{name: 'required'}],
      sort: [{name: 'required'}, {name: 'number'}],
      alias: [{name: 'required'}, {name: 'unique', model: 'FaqTopic', conditions: {alias: state.alias}}]
    })
    setErrors(errs)
    return errs
  }

  useEffect(async () => {
    if (isSaveClicked) {
      await validateFields()
    }
  }, [
    state.title,
    state.sort,
    state.alias
  ])

  useEffect(() => {
    setState({
      ...state,
      alias: state.title
    })
  }, [state.title])

  const onSave = async () => {
    try {
      if (!state.isSaveClicked) {
        setIsSaveClicked(true)
      }
      const formErrors = await validateFields()
      if (Object.keys(formErrors).length > 0) {
        return
      }
      const response = await faqtopic.store({
        title: state.title,
        alias: state.alias,
        sort: state.sort,
        status: state.status.value
      })
      onSaved(response)
      setErrors({})
      setIsSaveClicked(false)
      setState({ 
        ...state,
        title: '',
        alias: '',
        sort: 0,
        status: { label: 'Enabled', value: 'enabled' },
        successMessage: 'Successfully added'
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

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>Create Faq Topic</span>
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
              <div className='mb-2'>
                <Label>Title</Label>
                <Input placeholder='Title...' value={state.title} onChange={ e => setState({ ...state, title: e.target.value }) } invalid={ errors.title !== undefined } />
                <div className="invalid-feedback">{ errors.title !== undefined ? errors.title : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>Alias</Label>
                <Input placeholder='Alias...' value={state.alias} onChange={ e => setState({ ...state, alias: e.target.value }) } invalid={ errors.alias !== undefined } />
                <div className="invalid-feedback">{ errors.alias !== undefined ? errors.alias : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>Sort Priority</Label>
                <Input placeholder='Sort Pririty...' value={state.sort} onChange={ e => setState({ ...state, sort: e.target.value }) } invalid={ errors.sort !== undefined } />
                <div className="invalid-feedback">{ errors.sort !== undefined ? errors.sort : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>Status</Label>
                <Select
                  cacheOptions
                  defaultOptions
                  value={state.status}
                  options={[
                    { label: 'Enabled', value: 'enabled' },
                    { label: 'Disabled', value: 'disabled' }
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

export default FaqTopicCreate