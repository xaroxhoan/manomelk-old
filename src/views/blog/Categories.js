import { Card, CardHeader, CardBody, CardTitle, Button, Row, Col } from 'reactstrap'
import CategoriesDataTable from '@appcomponents/blogCategories/CategoriesDataTable'
import { useEffect, useState, lazy } from 'react'

const ArticleCategoriesList = () => {
  const [Component, setComponent] = useState(null)
  const [updateCounter, setUpdateCounter] = useState(0)
  const [createCounter, setCreateCounter] = useState(0)
  const [componentInfo, setComponentInfo] = useState({
    type: null,
    data: null
  })

  const onClickNewCategory = _ => {
    setComponentInfo({ ...componentInfo, type: 'create', data: null })
    setCreateCounter(createCounter + 1)
  }

  const onClickUpdate = row => {
    setComponentInfo({ ...componentInfo, type: 'update', data: row })
  }

  const onAddNew = (row) => {
    setComponentInfo({ ...componentInfo, type: 'create', data: row })
    setCreateCounter(createCounter + 1)
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
      setComponent(lazy(() => import('@appcomponents/blogCategories/CategoriesUpdate')))
    }
    if (componentInfo.type === 'create') {
      setComponent(lazy(() => import('@appcomponents/blogCategories/CategoriesCreate')))
    }
  }, [componentInfo.type])

  return (
    <div>
      <Row className='list-create-wrapper'>
        <Col lg={6} sm={12}>
          <Card>
            <CardHeader>
              <CardTitle className='has-action'>
                <span>Article Categories</span>
                <div className='actions'>
                  <Button block color='relief-primary' onClick={ onClickNewCategory }>Add New</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <CategoriesDataTable key={updateCounter} onClickUpdate={onClickUpdate} onAddNew={onAddNew} />
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

export default ArticleCategoriesList
