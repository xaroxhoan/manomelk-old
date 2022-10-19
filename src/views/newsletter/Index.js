import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Card, CardHeader, CardBody, CardTitle, Nav, NavItem, TabContent, TabPane, Button } from 'reactstrap'
import NewsLetterDataTable from '@appcomponents/newsletter/NewsLetterDataTable'
import useService from '../../hooks/service'

const NewsletterIndex = () => {
  const {newsletter} = useService()
  const [active, setActive] = useState('all')
  const query = useLocation()

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(query.search)
    let tab = params.get('tab')
    tab = tab === null || tab === '' ? 'all' : tab
    tab = ['approved', 'rejected'].indexOf(tab) < 0 ? 'all' : tab
    setActive(tab)
  }, [query.search])

  const onChangePublishSwitch = async (row, pagination, callbackFetchData) => {
    try {
       await newsletter.updateStatus(row._id, {
         status: row.status === 'approved' ? 'rejected' : 'approved'
       })
       await callbackFetchData(pagination.page)
     } catch (e) {}
  }


  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>NewsLetter</span>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Nav className='custom-tab' tabs>
            <NavItem>
              <NavLink active={(active === 'all').toString()} to={'/newsletter'} onClick={() => { toggle('all') }}>All newsletters</NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={(active === 'approved').toString()} to={'/newsletter?tab=approved'} onClick={() => { toggle('approved') }}>approved</NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={(active === 'rejected').toString()} to={'/newsletter?tab=rejected'} onClick={() => { toggle('rejected') }}>rejected</NavLink>
            </NavItem>
          </Nav>
          <TabContent className='tab-content-datatable py-50' activeTab={active.toString()}>
            { active === 'all' && <TabPane tabId='all'>
              <NewsLetterDataTable type={'all'} onChangePublishSwitch={onChangePublishSwitch} />
            </TabPane> }
            { active === 'approved' && <TabPane tabId='approved'>
              <NewsLetterDataTable type={'approved'} onChangePublishSwitch={onChangePublishSwitch} />
            </TabPane> }
            { active === 'rejected' && <TabPane tabId='rejected'>
              <NewsLetterDataTable type={'rejected'} onChangePublishSwitch={onChangePublishSwitch} />
            </TabPane> }
          </TabContent>
        </CardBody>
      </Card>
    </div>
  )
}

export default NewsletterIndex
