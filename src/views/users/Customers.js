import { Card, CardHeader, CardBody, CardTitle, Button, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import CustomersDataTable from '@appcomponents/customers/CustomersDataTable'
import { useState, lazy, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useService from '../../hooks/service'

const CustomersList = () => {
  const {users} = useService()
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
    tab = ['all', 'approved', 'rejected'].indexOf(tab) < 0 ? 'all' : tab
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

  const onClickShowCartItems = row => {
    setComponentInfo({ ...componentInfo, type: 'showcart', data: row })
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
      setComponent(lazy(() => import('@appcomponents/customers/CustomersUpdate')))
    }
    if (componentInfo.type === 'create') {
      setComponent(lazy(() => import('@appcomponents/customers/CustomersCreate')))
    }
    if (componentInfo.type === 'showcart') {
      setComponent(lazy(() => import('@appcomponents/customers/CustomersCartDataTable')))
    }
  }, [componentInfo.type])

  const onChangePublishSwitch = async (row, pagination, callbackFetchData) => {
    try {
       await users.updateStatus(row._id, {
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
                <span>Customers</span>
                <div className='actions'>
                  <Button block color='relief-primary' onClick={ onClickNewUser }>Add New</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Nav className='custom-tab mb-0' tabs>
                <NavItem>
                  <NavLink active={active === 'all'} to={'/customers'} onClick={() => { toggle('all') }}>all</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'approved'} to={'/customers?tab=approved'} onClick={() => { toggle('approved') }}>approved</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'rejected'} to={'/customers?tab=rejected'} onClick={() => { toggle('rejected') }}>rejected</NavLink>
                </NavItem>
              </Nav>
              <TabContent className='tab-content-datatable py-50' activeTab={active.toString()}>
                { active === 'all' && <TabPane tabId='all'>
                  <CustomersDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'all'} onClickUpdate={onClickUpdate} onClickShowCartItems={onClickShowCartItems} />
                </TabPane> }
                { active === 'approved' && <TabPane tabId='approved'>
                  <CustomersDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'approved'} onClickUpdate={onClickUpdate} onClickShowCartItems={onClickShowCartItems} />
                </TabPane> }
                { active === 'rejected' && <TabPane tabId='rejected'>
                  <CustomersDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'rejected'} onClickUpdate={onClickUpdate} onClickShowCartItems={onClickShowCartItems} />
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

export default CustomersList
