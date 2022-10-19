import React, { useState, useEffect } from 'react'
import { Row, Col, Card, CardHeader, CardBody, CardTitle, Label, Button, Input, Table } from 'reactstrap'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import useService from '../../hooks/service'
import BoxAlert from '@appcomponents/alert/BoxAlert'
import { Plus, Trash } from 'react-feather'

const ShopInfo = () => {
  const {setting} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState({
    phone: "",
    email: "",
    workingHour: "",
    phones: [],
    emails: [],
    workingHours: [],
    address: "",
    successMessage: ""
  })

  const isJson = (str) => {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }
  
  useEffect(async () => {
    try {
      setLoading(true)
      const phonesResponse = await setting.getByGroupAndKey('shopinfo', 'phones')
      const emailsResponse = await setting.getByGroupAndKey('shopinfo', 'emails')
      const addressResponse = await setting.getByGroupAndKey('shopinfo', 'address')
      const workingHourResponse = await setting.getByGroupAndKey('shopinfo', 'workingHours')
      const phones = isJson(phonesResponse.data.data.value) ? JSON.parse(phonesResponse.data.data.value) : []
      const emails = isJson(emailsResponse.data.data.value) ? JSON.parse(emailsResponse.data.data.value) : []
      const workingHours = isJson(workingHourResponse.data.data.value) ? JSON.parse(workingHourResponse.data.data.value) : []
      const address = addressResponse.data.data.value

      setState({
        ...state,
        phones,
        emails,
        workingHours,
        address,
        successMessage: ""
      })
      setErrors({})
      setLoading(false)
    } catch (e) {}
  }, [])


  const onSave = async () => {
    try {
      const response = await setting.storeMultiple('shopinfo', {
        phones: JSON.stringify(state.phones),
        emails: JSON.stringify(state.emails),
        address: state.address,
        workingHours: JSON.stringify(state.workingHours)
      })
      setState({ ...state, successMessage: response.data.message.message })
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

  const onClickAddPhone = () => {
    if (state.phone.trim().length <= 0) {
      return
    }
    setState({
      ...state,
      phone: "",
      phones: [...state.phones, state.phone]
    })
  }

  const onClickDeletePhone = (index) => {
    const phone = state.phones[index]
    if (phone === undefined) {
      return
    }
    const phones = [...state.phones]
    phones.splice(index, 1)
    setState({
      ...state,
      phones
    })
  }

  const onClickAddEmail = () => {
    if (state.email.trim().length <= 0) {
      return
    }
    setState({
      ...state,
      email: "",
      emails: [...state.emails, state.email]
    })
  }

  const onClickAddWorkingHours = () => {
    if (state.workingHour.trim().length <= 0) {
      return
    }
    setState({
      ...state,
      workingHour: "",
      workingHours: [...state.workingHours, state.workingHour]
    })
  }

  const onClickDeleteEmail = (index) => {
    const email = state.emails[index]
    if (email === undefined) {
      return
    }
    const emails = [...state.emails]
    emails.splice(index, 1)
    setState({
      ...state,
      emails
    })
  }

  const onClickDeleteWorkingHour = (index) => {
    const workingHour = state.workingHours[index]
    if (workingHour === undefined) {
      return
    }
    const workingHours = [...state.workingHours]
    workingHours.splice(index, 1)
    setState({
      ...state,
      workingHours
    })
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <Row className='fullwidth'>
            <Col lg='6' md='12' className='p-r-0'>
              <CardTitle className='has-action'>
                <span>Shop Info</span>
                <div className='actions'>
                  <Button color='relief-primary' onClick={ onSave }>Save</Button>
                </div>
              </CardTitle>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <BoxAlert type='success' visible={state.successMessage !== ''}>
            { state.successMessage }
          </BoxAlert>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Phones</Label>
                <div className='flex'>
                  <Input placeholder='phone...' value={state.phone} onChange={ e => setState({ ...state, phone: e.target.value }) } invalid={ errors.phone !== undefined } /> &nbsp;
                  <Button color='relief-info' onClick={onClickAddPhone}>
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Table>
                  <thead>
                    <tr>
                      <th>Phone</th>
                      <th style={{width: "70px"}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.phones.map((phone, index) => <tr key={"phone_" + index}>
                      <td>{phone}</td>
                      <td>
                        <Button color='relief-danger' size='sm' onClick={() => onClickDeletePhone(index)}>
                          <Trash size={16} />
                        </Button>
                      </td>
                    </tr>)}
                    {(loading === false && state.phones.length <= 0) && <tr>
                      <td colSpan={2} className="text-center">No phones yet!</td>  
                    </tr>}
                    {(loading === true && state.phones.length <= 0) && <tr>
                      <td colSpan={2} className="text-center">Loading...</td>  
                    </tr>}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Emails</Label>
                <div className='flex'>
                  <Input placeholder='email...' value={state.email} onChange={ e => setState({ ...state, email: e.target.value }) } invalid={ errors.email !== undefined } /> &nbsp;
                  <Button color='relief-info' onClick={onClickAddEmail}>
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Table>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th style={{width: "70px"}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.emails.map((email, index) => <tr key={"email_" + index}>
                      <td>{email}</td>
                      <td>
                        <Button color='relief-danger' size='sm' onClick={() => onClickDeleteEmail(index)}>
                          <Trash size={16} />
                        </Button>
                      </td>
                    </tr>)}
                    {(loading === false && state.emails.length <= 0) && <tr>
                      <td colSpan={2} className="text-center">No emails yet!</td>  
                    </tr>}
                    {(loading === true && state.emails.length <= 0) && <tr>
                      <td colSpan={2} className="text-center">Loading...</td>  
                    </tr>}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Working Hours</Label>
                <div className='flex'>
                  <Input placeholder='working hours...' value={state.workingHour} onChange={ e => setState({ ...state, workingHour: e.target.value }) } invalid={ errors.workingHour !== undefined } /> &nbsp;
                  <Button color='relief-info' onClick={onClickAddWorkingHours}>
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Table>
                  <thead>
                    <tr>
                      <th>Working Hours</th>
                      <th style={{width: "70px"}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.workingHours.map((workingHour, index) => <tr key={"workingHour_" + index}>
                      <td>{workingHour}</td>
                      <td>
                        <Button color='relief-danger' size='sm' onClick={() => onClickDeleteWorkingHour(index)}>
                          <Trash size={16} />
                        </Button>
                      </td>
                    </tr>)}
                    {(loading === false && state.workingHours.length <= 0) && <tr>
                      <td colSpan={2} className="text-center">No working hours yet!</td>  
                    </tr>}
                    {(loading === true && state.workingHours.length <= 0) && <tr>
                      <td colSpan={2} className="text-center">Loading...</td>  
                    </tr>}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Address</Label>
                <Input type='textarea' style={{height: "200px"}} placeholder='address...' value={state.address} onChange={ e => setState({ ...state, address: e.target.value }) } invalid={ errors.address !== undefined } /> &nbsp;
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default ShopInfo