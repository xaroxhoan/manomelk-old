import { Card, CardHeader, CardBody, CardTitle, Button, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import UsersDataTable from '@appcomponents/operators/OperatorsDataTable'
import { useState, lazy, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useService from '../../hooks/service'

const OperatorsList = () => {
  const {operators} = useService()
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
    tab = ['all', 'pending', 'active', 'banned'].indexOf(tab) < 0 ? 'all' : tab
    setActive(tab)
  }, [query.search])

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const onClickNewUser = _ => {
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
      setComponent(lazy(() => import('@appcomponents/operators/OperatorsUpdate')))
    }
    if (componentInfo.type === 'create') {
      setComponent(lazy(() => import('@appcomponents/operators/OperatorsCreate')))
    }
  }, [componentInfo.type])

  const onChangePublishSwitch = async (row, pagination, callbackFetchData) => {
    try {
       await operators.updateStatus(row._id, {
         status: row.status === 'approved' ? 'rejected' : 'approved'
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
                <span>اپراتورها</span>
                <div className='actions'>
                  <Button block color='relief-primary' onClick={ onClickNewUser }>اپراتور جدید</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Nav className='custom-tab mb-0' tabs>
                <NavItem>
                  <NavLink active={active === 'all'} to={'/operators'} onClick={() => { toggle('all') }}>همه</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'pending'} to={'/operators?tab=pending'} onClick={() => { toggle('pending') }}>در انتظار تایید</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'active'} to={'/operators?tab=active'} onClick={() => { toggle('active') }}>تایید شده ها</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'banned'} to={'/operators?tab=banned'} onClick={() => { toggle('banned') }}>مسدود شده ها</NavLink>
                </NavItem>
              </Nav>
              <TabContent className='tab-content-datatable py-50' activeTab={active.toString()}>
                { active === 'all' && <TabPane tabId='all'>
                  <UsersDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'all'} onClickUpdate={onClickUpdate} />
                </TabPane> }
                { active === 'pending' && <TabPane tabId='pending'>
                  <UsersDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'pending'} onClickUpdate={onClickUpdate} />
                </TabPane> }
                { active === 'active' && <TabPane tabId='active'>
                  <UsersDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'active'} onClickUpdate={onClickUpdate} />
                </TabPane> }
                { active === 'banned' && <TabPane tabId='banned'>
                  <UsersDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'banned'} onClickUpdate={onClickUpdate} />
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
          { Component !== null && componentInfo.type === 'update' && <Component key={componentInfo.data._id} onUpdated={onSaved} defaultInfo={componentInfo.data} onCancel={onCancel} />}
        </Col>
      </Row>
    </div>
  )
}

export default OperatorsList
