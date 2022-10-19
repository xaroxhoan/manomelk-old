import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Button } from 'reactstrap'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import { appendMessages, setMessageDefaultInfo, setMessageErrors, setMessageMessage, setMessageState, setMessageSuccessMessage } from '../../redux/messageSlice'
import MessagesList from './MessagesList'

const MessagesSend = ({ defaultInfo, onCancel }) => {
  const dispatch = useDispatch()
  const {messages} = useService()
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const [isSaveClicked, setIsSaveClicked] = useState(false)
  const websocket = useSelector(state => state.socket.instance)
  const state = useSelector(state => state.message)

  useEffect(() => {
    if (defaultInfo === null) {
      return
    }
    try {
      dispatch(setMessageDefaultInfo(defaultInfo))
      dispatch(setMessageSuccessMessage(""))
      dispatch(setMessageErrors({}))
    } catch (e) {}
  }, [defaultInfo])

  const validateFields = async _ => {
    const errs = await validate(state, {
      message: [{name: 'required'}]
    })
    dispatch(setMessageErrors(errs))
    return errs
  }

  useEffect(async () => {
    if (isSaveClicked === true) {
      await validateFields()
    }
  }, [state.message])

  const onSend = async () => {
    try {
      if (!state.isSaveClicked) {
        setIsSaveClicked(true)
      }
      const formErrors = await validateFields()
      if (Object.keys(formErrors).length > 0) {
        return
      }
      const response = await messages.storeChat({
        messageId: defaultInfo._id,
        description: state.message
      })
      if (response.status === 200) {
        dispatch(setMessageState({
          isSaveClicked: false,
          message: "",
          messages: [...state.messages, response.data.data],
          successMessage: response.data.message.message
        }))
        websocket.emit("message", response.data.data)
      }
    } catch (e) {
      if (e.response.status === 422) {
        const errs = {}
        e.response.data.messages.forEach(item => {
          errs[item.field] = item.message
        })
        dispatch(setMessageSuccessMessage(""))
        dispatch(setMessageErrors(errs))
      }
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>Chat Messages</span>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <MessagesList key={defaultInfo._id} defaultInfo={defaultInfo} />
          <Row>
            <Col lg='9' md='12'>
              <div className='mb-2'>
                <Input placeholder='Enter message here...' value={ state.message } onChange={ e => dispatch(setMessageMessage(e.target.value)) } invalid={ state.errors.message !== undefined } />
                <div className="invalid-feedback">{ state.errors.message !== undefined ? state.errors.message : '' }</div>
              </div>
            </Col>
            <Col lg='3' md='12'>
              <div className='actions'>
                <Button color='relief-primary' onClick={ onSend }>Send</Button>&nbsp;
                <Button color='relief-danger' onClick={ onCancel }>Cancel</Button>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default MessagesSend