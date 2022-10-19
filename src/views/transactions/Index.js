import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Card, CardHeader, CardBody, CardTitle, Nav, NavItem, TabContent, TabPane } from 'reactstrap'
import TransactionsDataTable from '@appcomponents/transactions/TransactionsDataTable'

const TransactionsIndex = () => {
  const [active, setActive] = useState('pending')
  const query = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(query.search)
    let tab = params.get('tab')
    tab = tab === null || tab === '' ? 'pending' : tab
    tab = ['pending', 'cancelled', 'completed'].indexOf(tab) < 0 ? 'pending' : tab
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
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardBody>
          <Nav className='custom-tab' tabs>
            <NavItem>
              <NavLink active={(active === 'pending').toString()} to={'/transactions'} onClick={() => { toggle('pending') }}>pending</NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={(active === 'cancelled').toString()} to={'/transactions?tab=cancelled'} onClick={() => { toggle('cancelled') }}>cancelled</NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={(active === 'completed').toString()} to={'/transactions?tab=completed'} onClick={() => { toggle('completed') }}>completed</NavLink>
            </NavItem>
          </Nav>
          <TabContent className='tab-content-datatable py-50' activeTab={active.toString()}>
            { active === 'pending' && <TabPane tabId='pending'>
              <TransactionsDataTable type={ 'pending' } />
            </TabPane> }
            { active === 'cancelled' && <TabPane tabId='cancelled'>
              <TransactionsDataTable type={ 'cancelled' } />
            </TabPane> }
            { active === 'completed' && <TabPane tabId='completed'>
              <TransactionsDataTable type={ 'completed' } />
            </TabPane> }
          </TabContent>
        </CardBody>
      </Card>
    </div>
  )
}

export default TransactionsIndex
