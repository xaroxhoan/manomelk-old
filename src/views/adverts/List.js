import { Card, CardHeader, CardBody, CardTitle, Button, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import AdvertsDataTable from '@appcomponents/adverts/AdvertsDataTable'
import { useState, lazy, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useService from '../../hooks/service'

const AdvertsList = () => {
  const {adverts} = useService()
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
    tab = ['all', 'pending', 'active', 'rejected'].indexOf(tab) < 0 ? 'all' : tab
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
      setComponent(lazy(() => import('@appcomponents/adverts/AdvertsUpdate')))
    }
    if (componentInfo.type === 'create') {
      setComponent(lazy(() => import('@appcomponents/adverts/AdvertsCreate')))
    }
  }, [componentInfo.type])

  const onChangePublishSwitch = async (row, pagination, callbackFetchData) => {
    try {
       await adverts.updateStatus(row._id, {
         status: row.status === 'active' ? 'rejected' : 'active'
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
                <span>آگهی ها</span>
                <div className='actions'>
                  <Button block color='relief-primary' onClick={ onClickNewUser }>آگهی جدید</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Nav className='custom-tab mb-0' tabs>
                <NavItem>
                  <NavLink active={active === 'all'} to={'/adverts'} onClick={() => { toggle('all') }}>همه</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'pending'} to={'/adverts?tab=pending'} onClick={() => { toggle('pending') }}>در انتظار تایید</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'active'} to={'/adverts?tab=active'} onClick={() => { toggle('active') }}>تایید شده ها</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'rejected'} to={'/adverts?tab=rejected'} onClick={() => { toggle('rejected') }}>رد شده ها</NavLink>
                </NavItem>
              </Nav>
              <TabContent className='tab-content-datatable py-50' activeTab={active.toString()}>
                { active === 'all' && <TabPane tabId='all'>
                  <AdvertsDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'all'} onClickUpdate={onClickUpdate} />
                </TabPane> }
                { active === 'pending' && <TabPane tabId='pending'>
                  <AdvertsDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'pending'} onClickUpdate={onClickUpdate} />
                </TabPane> }
                { active === 'active' && <TabPane tabId='active'>
                  <AdvertsDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'active'} onClickUpdate={onClickUpdate} />
                </TabPane> }
                { active === 'rejected' && <TabPane tabId='rejected'>
                  <AdvertsDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'rejected'} onClickUpdate={onClickUpdate} />
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

export default AdvertsList
