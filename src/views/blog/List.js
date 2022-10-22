import { Card, CardHeader, CardBody, CardTitle, Button, Nav, NavItem, TabContent, TabPane } from 'reactstrap'
import { Plus } from 'react-feather'
import { NavLink, useLocation, useHistory } from 'react-router-dom'
import DataTableActionButton from '@appcomponents/DataTableActionButton'
import { useEffect, useState } from 'react'
import BlogDataTable from '@appcomponents/blog/BlogDataTable'
import useService from '../../hooks/service'

const BlogList = () => {
  const {blog} = useService()
  const [active, setActive] = useState('enabled')
  const query = useLocation()
  const history = useHistory()

  useEffect(() => {
    const params = new URLSearchParams(query.search)
    let tab = params.get('tab')
    tab = tab === null || tab === '' ? 'enabled' : tab
    tab = ['enabled', 'disabled', 'draft'].indexOf(tab) < 0 ? 'enabled' : tab
    setActive(tab)
  }, [query.search])

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const onClickNewProduct = () => {
    history.push('/articles/create')
  }

  const onChangePublishSwitch = async (row, pagination, callbackFetchData) => {
    try {
       await blog.updateStatus(row._id, {
         status: row.status === 'enabled' ? 'disabled' : 'enabled'
       })
       await callbackFetchData(pagination.page)
     } catch (e) {}
  }

  const onClickUpdate = row => {
    history.push(`/articles/update/${row._id}`)
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>Articles</span>
            <div className='actions'>
              <Button block color='relief-primary' onClick={ onClickNewProduct }>
                <Plus size={16} />
                Add New
              </Button>
              <DataTableActionButton />
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Nav className='custom-tab' tabs>
            <NavItem>
              <NavLink active={(active === 'enabled').toString()} to={'/articles'} onClick={() => { toggle('enabled') }}>enabled</NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={(active === 'disabled').toString()} to={'/articles?tab=disabled'} onClick={() => { toggle('disabled') }}>disabled</NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={(active === 'draft').toString()} to={'/articles?tab=draft'} onClick={() => { toggle('draft') }}>draft</NavLink>
            </NavItem>
          </Nav>
          <TabContent className='tab-content-datatable py-50' activeTab={active.toString()}>
            { active === 'enabled' && <TabPane tabId='enabled'>
              <BlogDataTable onChangePublishSwitch={onChangePublishSwitch} type={'enabled'} onClickUpdate={onClickUpdate} />
            </TabPane> }
            { active === 'disabled' && <TabPane tabId='disabled'>
              <BlogDataTable onChangePublishSwitch={onChangePublishSwitch} type={'disabled'} onClickUpdate={onClickUpdate} />
            </TabPane> }
            { active === 'draft' && <TabPane tabId='draft'>
              <BlogDataTable onChangePublishSwitch={onChangePublishSwitch} type={'draft'} onClickUpdate={onClickUpdate} />
            </TabPane> }
          </TabContent>
        </CardBody>
      </Card>
    </div>
  )
}

export default BlogList
