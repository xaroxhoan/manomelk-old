import { Card, CardHeader, CardBody, CardTitle, Button, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import MessagesDataTable from '@appcomponents/messages/MessagesDataTable'
import { useState, lazy, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useService from '../../hooks/service'

const MessagesList = () => {
  const {messages} = useService()
  const query = useLocation()
  const [active, setActive] = useState('open')
  const [Component, setComponent] = useState(null)
  const [messagesCounter, setUpdateCounter] = useState(0)
  const [componentInfo, setComponentInfo] = useState({
    type: null,
    data: null
  })

  useEffect(() => {
    const params = new URLSearchParams(query.search)
    let tab = params.get('tab')
    tab = tab === null || tab === '' ? 'open' : tab
    tab = ['open', 'close'].indexOf(tab) < 0 ? 'open' : tab
    setActive(tab)
  }, [query.search])

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const onClickNewMessage = _ => {
    setComponentInfo({ ...componentInfo, type: 'create' })
  }

  const onClickMessagesList = row => {
    setComponentInfo({ ...componentInfo, type: 'messages', data: row })
  }

  const onSaved = _ => {
    setUpdateCounter(messagesCounter + 1)
  }

  const onCancel = _ => {
    setComponent(null)
    setComponentInfo({ ...componentInfo, type: null })
  }

  useEffect(() => {
    if (componentInfo.type === 'messages') {
      setComponent(lazy(() => import('@appcomponents/messages/MessagesSend')))
    }
    if (componentInfo.type === 'create') {
      setComponent(lazy(() => import('@appcomponents/messages/MessagesCreate')))
    }
  }, [componentInfo.type])

  const onChangePublishSwitch = async (row, pagination, callbackFetchData) => {
    try {
       await messages.updateStatus(row._id, {
         status: row.status === 'open' ? 'close' : 'open'
       })
       await callbackFetchData(pagination.page)
     } catch (e) {}
  }

  return (
    <div>
      <Row className='list-create-wrapper'>
        <Col lg={6} sm={12}>
          <Card>
            <CardHeader>
              <CardTitle className='has-action'>
                <span>Messages</span>
                <div className='actions'>
                  <Button block color='relief-primary' onClick={ onClickNewMessage }>Send New</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Nav className='custom-tab mb-0' tabs>
                <NavItem>
                  <NavLink active={active === 'open'} to={'/messages'} onClick={() => { toggle('open') }}>open</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'close'} to={'/messages?tab=close'} onClick={() => { toggle('close') }}>close</NavLink>
                </NavItem>
              </Nav>
              <TabContent className='tab-content-datatable py-50' activeTab={active.toString()}>
                { active === 'open' && <TabPane tabId='open'>
                  <MessagesDataTable key={messagesCounter} onChangePublishSwitch={onChangePublishSwitch} type={'open'} onClickMessagesList={onClickMessagesList} />
                </TabPane> }
                { active === 'close' && <TabPane tabId='close'>
                  <MessagesDataTable key={messagesCounter} onChangePublishSwitch={onChangePublishSwitch} type={'close'} onClickMessagesList={onClickMessagesList} />
                </TabPane> }
              </TabContent>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} sm={12}>
          { Component === null && <Card>
            <CardHeader>
              <CardTitle>
                <span>No Record Selected</span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className='no-records'>No Record Selected</div>
            </CardBody>
          </Card> }
          { Component !== null && componentInfo.type === 'create' && <Component onSaved={onSaved} onCancel={onCancel} />}
          { Component !== null && componentInfo.type === 'messages' && <Component key={componentInfo.data._id} onUpdated={onSaved} defaultInfo={componentInfo.data} onCancel={onCancel} />}
        </Col>
      </Row>
    </div>
  )
}

export default MessagesList
