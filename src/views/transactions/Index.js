import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Card, CardHeader, CardBody, CardTitle, Nav, NavItem, TabContent, TabPane } from 'reactstrap'
import TransactionsDataTable from '@appcomponents/transactions/TransactionsDataTable'

const TransactionsIndex = () => {
  const [active, setActive] = useState('all')
  const query = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(query.search)
    let tab = params.get('tab')
    tab = tab === null || tab === '' ? 'all' : tab
    tab = ["all", "pending", "success", "fail"].indexOf(tab) < 0 ? 'all' : tab
    setActive(tab)
  }, [query.search])

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>تراکنش ها</CardTitle>
        </CardHeader>
        <CardBody>
          <Nav className='custom-tab' tabs>
            <NavItem>
              <NavLink active={(active === 'all').toString()} to={'/transactions'} onClick={() => { toggle('all') }}>همه تراکنش ها</NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={(active === 'pending').toString()} to={'/transactions'} onClick={() => { toggle('pending') }}>تراکنش های در حال تایید</NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={(active === 'success').toString()} to={'/transactions?tab=success'} onClick={() => { toggle('success') }}>تراکنش های موفق</NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={(active === 'fail').toString()} to={'/transactions?tab=fail'} onClick={() => { toggle('fail') }}>تراکنش های ناموفق</NavLink>
            </NavItem>
          </Nav>
          <TabContent className='tab-content-datatable py-50' activeTab={active.toString()}>
            { active === 'all' && <TabPane tabId='all'>
              <TransactionsDataTable type={ 'all' } />
            </TabPane> }
            { active === 'pending' && <TabPane tabId='pending'>
              <TransactionsDataTable type={ 'pending' } />
            </TabPane> }
            { active === 'success' && <TabPane tabId='success'>
              <TransactionsDataTable type={ 'success' } />
            </TabPane> }
            { active === 'fail' && <TabPane tabId='fail'>
              <TransactionsDataTable type={ 'fail' } />
            </TabPane> }
          </TabContent>
        </CardBody>
      </Card>
    </div>
  )
}

export default TransactionsIndex
