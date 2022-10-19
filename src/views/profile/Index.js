import { useEffect, useState } from 'react'
import useService from "../../hooks/service"
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Label, Input, Button, Alert } from 'reactstrap'
import BoxAlert from '@appcomponents/alert/BoxAlert'

const ProfileIndex = () => {
  const {users} = useService()
  const [errors, setErrors] = useState({})
  const [state, setState] = useState({
    user: null,
    lastPassword: "",
    newPassword: "",
    repeatNewPassword: "",
    successMessage: ''
  })
  
  useEffect(async () => {
    try {
      const response = await users.who()
      const defaultInfo = response.data.data
      setState({
        ...state,
        user: defaultInfo,
        successMessage: ''
      })
      setErrors({})
    } catch (e) {}
  }, [])

  const onSave = async () => {
    if (state.user === null) {
      return
    }
    try {
      const response = await users.updatePassword(state.lastPassword, state.newPassword)
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

  return (
    <div>
      <Row>
        <Col lg="6" md="6">
          <Card>
            <CardHeader>
              <CardTitle className='has-sub'>
                <strong>Change Password</strong>
                <small>You can change your password authentication</small>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <BoxAlert type='success' visible={state.successMessage !== ''}>
                { state.successMessage }
              </BoxAlert>
              <Row>
                <Col lg='6' md='12'>
                  <div className='mb-2'>
                    <Label>Last Password</Label>
                    <Input type="password" placeholder='Last Password...' value={state.lastPassword} onChange={ e => setState({ ...state, lastPassword: e.target.value }) } invalid={ errors.lastPassword !== undefined } />
                    <div className="invalid-feedback">{ errors.lastPassword !== undefined ? errors.lastPassword : '' }</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg='6' md='12'>
                  <div className='mb-2'>
                    <Label>New Password</Label>
                    <Input type="password" placeholder='New Password...' value={state.newPassword} onChange={ e => setState({ ...state, newPassword: e.target.value }) } invalid={ errors.newPassword !== undefined } />
                    <div className="invalid-feedback">{ errors.newPassword !== undefined ? errors.newPassword : '' }</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg='6' md='12'>
                  <div className='mb-2'>
                    <Label>Repeat New Password</Label>
                    <Input type="password" placeholder='Repeat New Password...' value={state.repeatNewPassword} onChange={ e => setState({ ...state, repeatNewPassword: e.target.value }) } invalid={ errors.repeatNewPassword !== undefined } />
                    <div className="invalid-feedback">{ errors.repeatNewPassword !== undefined ? errors.repeatNewPassword : '' }</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg='12' md='12'>
                  <Button color='relief-primary' onClick={ onSave }>Save</Button>&nbsp;
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ProfileIndex
