import { Card, CardHeader, CardBody, CardTitle, Button, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import FaqTopicDataTable from '@appcomponents/faqTopic/FaqTopicDataTable'
import { useState, lazy, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useService from '../../hooks/service'

const FaqTopicList = () => {
  const {faqtopic} = useService()
  const query = useLocation()
  const [active, setActive] = useState('all')
  const [Component, setComponent] = useState(null)
  const [updateCounter, setUpdateCounter] = useState(0)
  const [componentInfo, setComponentInfo] = useState({
    type: null,
    data: null
  })

  useEffect(() => {
    const params = new URLSearchParams(query.search)
    let tab = params.get('tab')
    tab = tab === null || tab === '' ? 'all' : tab
    tab = ['all', 'enabled', 'disabled'].indexOf(tab) < 0 ? 'all' : tab
    setActive(tab)
  }, [query.search])

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const onClickNewFaqTopic = _ => {
    setComponentInfo({ ...componentInfo, type: 'create' })
  }

  const onClickUpdate = row => {
    setComponentInfo({ ...componentInfo, type: 'update', data: row })
  }

  const onSaved = _ => {
    setUpdateCounter(updateCounter + 1)
  }

  const onCancel = _ => {
    setComponent(null)
    setComponentInfo({ ...componentInfo, type: null })
  }

  useEffect(() => {
    if (componentInfo.type === 'update') {
      setComponent(lazy(() => import('@appcomponents/faqTopic/FaqTopicUpdate')))
    }
    if (componentInfo.type === 'create') {
      setComponent(lazy(() => import('@appcomponents/faqTopic/FaqTopicCreate')))
    }
  }, [componentInfo.type])

  const onChangePublishSwitch = async (row, pagination, callbackFetchData) => {
    try {
       await faqtopic.updateStatus(row._id, {
         status: row.status === 'enabled' ? 'disabled' : 'enabled'
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
                <span>???????? ?????? ???????????? ????????????</span>
                <div className='actions'>
                  <Button block color='relief-primary' onClick={ onClickNewFaqTopic }>???????? ????????</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Nav className='custom-tab mb-0' tabs>
                <NavItem>
                  <NavLink active={active === 'all'} to={'/faqtopic'} onClick={() => { toggle('all') }}>??????</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'enabled'} to={'/faqtopic?tab=enabled'} onClick={() => { toggle('enabled') }}>???????? ????</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'disabled'} to={'/faqtopic?tab=disabled'} onClick={() => { toggle('disabled') }}>?????????????? ????</NavLink>
                </NavItem>
              </Nav>
              <TabContent className='tab-content-datatable py-50' activeTab={active.toString()}>
                { active === 'all' && <TabPane tabId='all'>
                  <FaqTopicDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'all'} onClickUpdate={onClickUpdate} />
                </TabPane> }
                { active === 'enabled' && <TabPane tabId='enabled'>
                  <FaqTopicDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'enabled'} onClickUpdate={onClickUpdate} />
                </TabPane> }
                { active === 'disabled' && <TabPane tabId='disabled'>
                  <FaqTopicDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'disabled'} onClickUpdate={onClickUpdate} />
                </TabPane> }
              </TabContent>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} sm={12}>
          { Component === null && <Card>
            <CardHeader>
              <CardTitle>
                <span>?????? ?????????? ???????????? ???????? ??????</span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className='no-records'>?????? ?????????? ???????????? ???????? ??????</div>
            </CardBody>
          </Card> }
          { Component !== null && componentInfo.type === 'create' && <Component onSaved={onSaved} onCancel={onCancel} />}
          { Component !== null && componentInfo.type === 'update' && <Component key={componentInfo.data._id} onUpdated={onSaved} defaultInfo={componentInfo.data} onCancel={onCancel} />}
        </Col>
      </Row>
    </div>
  )
}

export default FaqTopicList
