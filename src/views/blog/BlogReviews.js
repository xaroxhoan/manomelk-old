import { Card, CardHeader, CardBody, CardTitle, Button, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { useEffect, useState, lazy } from 'react'
import CommentsDataTable from '@appcomponents/blog/CommentsDataTable'
import { useLocation } from 'react-router-dom'
import useService from '../../hooks/service'

const BlogReviews = () => {
  const {blog} = useService()
  const query = useLocation()
  const [active, setActive] = useState('approved')
  const [Component, setComponent] = useState(null)
  const [updateCounter, setUpdateCounter] = useState(0)
  const [createCounter, setCreateCounter] = useState(0)
  const [componentInfo, setComponentInfo] = useState({
    type: null,
    data: null
  })

  useEffect(() => {
    const params = new URLSearchParams(query.search)
    let tab = params.get('tab')
    tab = tab === null || tab === '' ? 'approved' : tab
    tab = ['approved', 'pending'].indexOf(tab) < 0 ? 'approved' : tab
    setActive(tab)
  }, [query.search])

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const onClickNewComment = _ => {
    setComponentInfo({ ...componentInfo, type: 'create', data: null })
    setCreateCounter(createCounter + 1)
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
      setComponent(lazy(() => import('@appcomponents/blog/CommentsUpdate')))
    }
    if (componentInfo.type === 'create') {
      setComponent(lazy(() => import('@appcomponents/blog/CommentsCreate')))
    }
  }, [componentInfo.type])

  const onChangePublishSwitch = async (row, pagination, callbackFetchData) => {
    try {
       await blog.reviews.updateStatus(row._id, {
         status: row.status === 'approved' ? 'pending' : 'approved'
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
                <span>Reviews</span>
                <div className='actions'>
                  <Button block color='relief-primary' onClick={ onClickNewComment }>Add New</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Nav className='custom-tab mb-0' tabs>
                <NavItem>
                  <NavLink active={active === 'approved'} to={'/reviews'} onClick={() => { toggle('approved') }}>approved</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'pending'} to={'/reviews?tab=pending'} onClick={() => { toggle('pending') }}>pending</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={active === 'rejected'} to={'/reviews?tab=rejected'} onClick={() => { toggle('rejected') }}>rejected</NavLink>
                </NavItem>
              </Nav>
              <TabContent className='tab-content-datatable py-50' activeTab={active.toString()}>
                { active === 'approved' && <TabPane tabId='approved'>
                  <CommentsDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'approved'} onClickUpdate={onClickUpdate} />
                </TabPane> }
                { active === 'pending' && <TabPane tabId='pending'>
                  <CommentsDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'pending'} onClickUpdate={onClickUpdate} />
                </TabPane> }
                { active === 'rejected' && <TabPane tabId='rejected'>
                  <CommentsDataTable key={updateCounter} onChangePublishSwitch={onChangePublishSwitch} type={'rejected'} onClickUpdate={onClickUpdate} />
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
          { Component !== null && componentInfo.type === 'create' && <Component key={createCounter} defaultInfo={componentInfo.data} onSaved={onSaved} onCancel={onCancel} />}
          { Component !== null && componentInfo.type === 'update' && <Component key={componentInfo.data._id} onUpdated={onSaved} defaultInfo={componentInfo.data} onCancel={onCancel} />}
        </Col>
      </Row>
    </div>
  )
}

export default BlogReviews
