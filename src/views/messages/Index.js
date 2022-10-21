import { Card, CardHeader, CardBody, CardTitle, Button, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import MessagesDataTable from '@appcomponents/messages/MessagesDataTable'
import { useState, lazy, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useService from '../../hooks/service'

const MessagesList = () => {
  const {messages} = useService()
  const query = useLocation()
  const [active, setActive] = useState('all')
  const [Component, setComponent] = useState(null)
  const [messagesCounter, setUpdateCounter] = useState(0)
  const [componentInfo, setComponentInfo] = useState({
    type: null,
    data: null
  })

  useEffect(() => {
    const params = new URLSearchParams(query.search)
    let tab = params.get('tab')
    tab = tab === null || tab === '' ? 'all' : tab
    tab = ['all', 'opened', 'closed', 'disabled'].indexOf(tab) < 0 ? 'all' : tab
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
         status: row.status === 'opened' ? 'closed' : 'opened'
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
                <span>تیکت ها</span>
                <div className='actions'>
                  <Button block color='relief-primary' onClick={ onClickNewMessage }>تیکت جدید</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Nav className='custom-tab mb-0' tabs>
                <NavItem>
                  <NavLink active={active === 'all'} to={'/messages'} onClick={() => { toggle('all') }}>همه</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'opened'} to={'/messages?tab=opened'} onClick={() => { toggle('opened') }}>باز</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'closed'} to={'/messages?tab=closed'} onClick={() => { toggle('closed') }}>بسته</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'disabled'} to={'/messages?tab=disabled'} onClick={() => { toggle('disabled') }}>غیرفعال</NavLink>
                </NavItem>
              </Nav>
              <TabContent className='tab-content-datatable py-50' activeTab={active.toString()}>
                { active === 'all' && <TabPane tabId='all'>
                  <MessagesDataTable key={messagesCounter} onChangePublishSwitch={onChangePublishSwitch} type={'all'} onClickMessagesList={onClickMessagesList} />
                </TabPane> }
                { active === 'opened' && <TabPane tabId='opened'>
                  <MessagesDataTable key={messagesCounter} onChangePublishSwitch={onChangePublishSwitch} type={'opened'} onClickMessagesList={onClickMessagesList} />
                </TabPane> }
                { active === 'closed' && <TabPane tabId='closed'>
                  <MessagesDataTable key={messagesCounter} onChangePublishSwitch={onChangePublishSwitch} type={'closed'} onClickMessagesList={onClickMessagesList} />
                </TabPane> }
                { active === 'disabled' && <TabPane tabId='disabled'>
                  <MessagesDataTable key={messagesCounter} onChangePublishSwitch={onChangePublishSwitch} type={'disabled'} onClickMessagesList={onClickMessagesList} />
                </TabPane> }
              </TabContent>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} sm={12}>
          { Component === null && <Card>
            <CardHeader>
              <CardTitle>
                <span>هیچ آیتمی انتخاب نشده است</span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className='no-records'>هیچ آیتمی انتخاب نشده است</div>
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
