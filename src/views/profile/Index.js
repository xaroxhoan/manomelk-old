import { useEffect, useState } from 'react'
import useService from "../../hooks/service"
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Label, Input, Button, Alert } from 'reactstrap'
import BoxAlert from '@appcomponents/alert/BoxAlert'
import useToast from '../../hooks/toast'

const ProfileIndex = () => {
  const {users} = useService()
  const [errors, setErrors] = useState({})
  const [state, setState] = useState({
    user: null,
    lastPassword: "",
    newPassword: "",
    repeatNewPassword: ""
  })
  const {toastError, toastSuccess} = useToast()
  
  useEffect(async () => {
    try {
      const response = await users.who()
      const defaultInfo = response.data.result
      setState({
        ...state,
        user: defaultInfo
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
      <Row>
        <Col lg="6" md="6">
          <Card>
            <CardHeader>
              <CardTitle className='has-sub'>
                <strong>تغییر رمز عبور</strong>
                <small>در این بخش می توانید رمز عبور خود را تغییر دهید</small>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg='6' md='12'>
                  <div className='mb-2'>
                    <Label>رمز عبور قبلی</Label>
                    <Input type="password" placeholder='رمز عبور قبلی...' value={state.lastPassword} onChange={ e => setState({ ...state, lastPassword: e.target.value }) } invalid={ errors.lastPassword !== undefined } />
                    <div className="invalid-feedback">{ errors.lastPassword !== undefined ? errors.lastPassword : '' }</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg='6' md='12'>
                  <div className='mb-2'>
                    <Label>رمز عبور جدید</Label>
                    <Input type="password" placeholder='رمز عبور جدید...' value={state.newPassword} onChange={ e => setState({ ...state, newPassword: e.target.value }) } invalid={ errors.newPassword !== undefined } />
                    <div className="invalid-feedback">{ errors.newPassword !== undefined ? errors.newPassword : '' }</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg='6' md='12'>
                  <div className='mb-2'>
                    <Label>تکرار رمز عبور جدید</Label>
                    <Input type="password" placeholder='تکرار رمز عبور جدید...' value={state.repeatNewPassword} onChange={ e => setState({ ...state, repeatNewPassword: e.target.value }) } invalid={ errors.repeatNewPassword !== undefined } />
                    <div className="invalid-feedback">{ errors.repeatNewPassword !== undefined ? errors.repeatNewPassword : '' }</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg='12' md='12'>
                  <Button color='relief-primary' onClick={ onSave }>ثبت</Button>&nbsp;
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
