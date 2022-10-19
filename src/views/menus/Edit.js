import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Label, Button, Alert } from 'reactstrap'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import useService from '../../hooks/service'
import BoxAlert from '@appcomponents/alert/BoxAlert'

const MenusEdit = ({ match }) => {
  const {categories, brands, products, menus} = useService()
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState({
    title: '',
    slug: '',
    type: { label: 'Category', value: 'category' },
    types: [
      { label: 'Category', value: 'category' },
      { label: 'Product', value: 'product' },
      { label: 'Brand', value: 'brand' },
      { label: 'External Url', value: 'externalUrl' }
    ],
    subMenuGroup: null,
    category: null,
    brand: null,
    product: null,
    mainMenu: null,
    menuType: 'menu',
    status: { label: 'Visible', value: 'visible' },
    externalUrl: '',
    statusAll: [
      { label: 'Visible', value: 'visible' },
      { label: 'Draft', value: 'draft' },
      { label: 'Hide', value: 'hide' }
    ],
    order: 0,
    errors: {},
    successMessage: ''
  })

  useEffect(async () => {
    try {
      setLoading(true)
      const response = await menus.get(match.params.id)
      const data = response.data.data
      if (data === null) {
        return
      }
      let type = { label: 'Category', value: 'category' }
      if (data.brand !== null) {
        type = { label: 'Brand', value: 'brand' }
      }
      if (data.product !== null) {
        type = { label: 'Product', value: 'product' }
      }
      if (data.brand !== null) {
        type = { label: 'Brand', value: 'brand' }
      }
      if (data.isExternalUrl === true) {
        type = { label: 'External Url', value: 'externalUrl' }
      }
      const menuType = data.parent !== null ? (data.isGroup === true ? 'subMenuGroup' : 'subMenuGroupChild') : 'menu'
      setState({
        ...state,
        title: data.title,
        slug: data.slug,
        type,
        subMenuGroup: menuType !== 'menu' ? (data.parent.parent !== null ? { value: data.parent._id, label: data.parent.title } : null) : null,
        category: data.category !== null ? { label: data.category.title, value: data.category._id } : null,
        brand: data.brand !== null ? { label: data.brand.title, value: data.brand._id } : null,
        product: data.product !== null ? { label: data.product.title, value: data.product._id } : null,
        mainMenu: menuType !== 'menu' ? (data.parent.parent !== null ? { value: data.parent.parent._id, label: data.parent.parent.title } : { value: data.parent._id, label: data.parent.title }) : null,
        menuType,
        status: { label: data.status.charAt(0).toUpperCase() + data.status.slice(1), value: data.status },
        externalUrl: data.externalUrl,
        order: data.order,
        errors: {},
        successMessage: ''
      })
      setLoading(false)
    } catch (e) {}
  }, [])

  const loadCategories = async (inputValue, callback) => {
    const response = await categories.fetchAll()
    return response.data.data.map(item => {
      return {
        value: item._id,
        label: item.title
      }
    })
  }

  const loadBrands = async (inputValue, callback) => {
    const response = await brands.fetchAll()
    return response.data.data.map(item => {
      return {
        value: item._id,
        label: item.title
      }
    })
  }

  const loadProducts = async (inputValue, callback) => {
    const response = await products.fetchAll()
    return response.data.data.items.map(item => {
      return {
        value: item._id,
        label: item.title
      }
    })
  }

  const loadMainMenus = async (inputValue, callback) => {
    const response = await menus.fetchAllMainMenus()
    return response.data.data.map(item => {
      return {
        value: item._id,
        label: item.title
      }
    })
  }

  const loadSubMenuGroup = async (inputValue, callback) => {
    const response = await menus.fetchAllSubMenuGroups({ mainMenu: state.mainMenu.value })
    return response.data.data.map(item => {
      return {
        value: item._id,
        label: item.title
      }
    })
  }

  const onHandleCategoryChange = selectedValue => {
    setState({ 
      ...state,
      category: selectedValue
    })
  }

  const onHandleBrandChange = selectedValue => {
    setState({ 
      ...state,
      brand: selectedValue
    })
  }

  const onHandleProductChange = selectedValue => {
    setState({ 
      ...state,
      product: selectedValue
    })
  }

  const onHandleMainMenuChange = selectedValue => {
    setState({ 
      ...state,
      mainMenu: selectedValue
    })
  }

  const onHandleSubMenuGroupChange = selectedValue => {
    setState({ 
      ...state,
      subMenuGroup: selectedValue
    })
  }

  const onUpdate = async () => {
    try {
      const response = await menus.update(match.params.id, {
        title: state.title,
        slug: state.slug,
        type: state.type.value,
        menuType: state.menuType,
        mainMenu: state.mainMenu !== null ? state.mainMenu.value : state.mainMenu,
        subMenuGroup: state.subMenuGroup !== null ? state.subMenuGroup.value : state.subMenuGroup,
        externalUrl: state.externalUrl,
        category: state.category !== null ? state.category.value : state.category,
        brand: state.brand !== null ? state.brand.value : state.brand,
        product: state.product !== null ? state.product.value : state.product,
        status: state.status.value,
        order: state.order
      })
      setState({
        ...state,
        errors: {},
        successMessage: response.data.message.message 
      })
    } catch (e) {
      if (e.response.status === 422) {
        const errors = {}
        e.response.data.messages.forEach(item => {
          errors[item.field] = item.message
        })
        setState({ ...state, errors, successMessage: '' })
      }
    }
  }

  const onChangeMenuType = e => {
    setState({
      ...state,
      menuType: e.target.value
    })
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Update Menu</CardTitle>
        </CardHeader>
        <CardBody>
          <BoxAlert type='success' visible={state.successMessage !== ''}>
            { state.successMessage }
          </BoxAlert>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <div className='custom-radio-groups custom-radio-groups-menu-type'>
                  <label className='custom-radio'>
                    <input type={'radio'} name="menuType" value={'menu'} checked={state.menuType === 'menu'} onChange={ onChangeMenuType } />
                    <span>
                      <span>Menu</span>
                      <span>Main menu that appears in the bottom of navbar</span>
                    </span>
                  </label>
                  <label className='custom-radio'>
                    <input type={'radio'} name="menuType" value={'subMenuGroup'} checked={state.menuType === 'subMenuGroup'} onChange={ onChangeMenuType } />
                    <span>
                      <span>Sub-menu Group</span>
                      <span>Child of main menu</span>
                    </span>
                  </label>
                  <label className='custom-radio'>
                    <input type={'radio'} name="menuType" value={'subMenuGroupChild'} checked={state.menuType === 'subMenuGroupChild'} onChange={ onChangeMenuType } />
                    <span>
                      <span>Sub-menu Group's Child</span>
                      <span>Child of groups inside main menu</span>
                    </span>
                  </label>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={state.menuType === 'subMenuGroup' ? '6' : '12'} md='12'>
              <div className='mb-2'>
                <Label>Type</Label>
                <Select
                  cacheOptions
                  defaultOptions
                  value={state.type}
                  options={state.types}
                  onChange={ selectedType => setState({ ...state, type: selectedType }) }
                />
                <div className="invalid-feedback">{ state.errors.type !== undefined ? state.errors.type : '' }</div>
              </div>
            </Col>
            { state.menuType === 'subMenuGroup' && <Col lg='6' md='12'>
              <div className={`mb-2 select-wrapper ${ state.errors.mainMenu !== undefined ? 'has-error' : '' }`}>
                <Label>Menu</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={ loadMainMenus }
                  onChange={ onHandleMainMenuChange }
                  value={ state.mainMenu }
                />
                <div className="invalid-feedback">{ state.errors.mainMenu !== undefined ? state.errors.mainMenu : '' }</div>
              </div>
            </Col> }
          </Row>
          { state.menuType === 'subMenuGroupChild' && <Row>
            <Col lg='6' md='12'>
              <div className={`mb-2 select-wrapper ${ state.errors.mainMenu !== undefined ? 'has-error' : '' }`}>
                <Label>Menu</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={ loadMainMenus }
                  onChange={ onHandleMainMenuChange }
                  value={ state.mainMenu }
                />
                <div className="invalid-feedback">{ state.errors.mainMenu !== undefined ? state.errors.mainMenu : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className={`mb-2 select-wrapper ${ state.errors.mainMenu !== undefined ? 'has-error' : '' }`}>
                <Label>Sub-menu Group</Label>
                <AsyncSelect
                  key={ state.mainMenu }
                  cacheOptions
                  defaultOptions
                  loadOptions={ loadSubMenuGroup }
                  onChange={ onHandleSubMenuGroupChange }
                  value={ state.subMenuGroup }
                />
                <div className="invalid-feedback">{ state.errors.mainMenu !== undefined ? state.errors.mainMenu : '' }</div>
              </div>
            </Col>
          </Row> }
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Title</Label>
                <Input placeholder='Title...' onChange={ e => setState({ ...state, title: e.target.value }) } invalid={ state.errors.title !== undefined } value={state.title} />
                <div className="invalid-feedback">{ state.errors.title !== undefined ? state.errors.title : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Slug</Label>
                <Input placeholder='Slug...' onChange={ e => setState({ ...state, slug: e.target.value }) } invalid={ state.errors.slug !== undefined } value={state.slug} />
                <div className="invalid-feedback">{ state.errors.slug !== undefined ? state.errors.slug : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            { state.type.value === 'category' && <Col lg='6' md='12'>
              <div className={`mb-2 select-wrapper ${ state.errors.category !== undefined ? 'has-error' : '' }`}>
                <Label>Category</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={ loadCategories }
                  onChange={ onHandleCategoryChange }
                  value={state.category}
                />
                <div className="invalid-feedback">{ state.errors.category !== undefined ? state.errors.category : '' }</div>
              </div>
            </Col> }
            { state.type.value === 'brand' && <Col lg='6' md='12'>
              <div className={`mb-2 select-wrapper ${ state.errors.brand !== undefined ? 'has-error' : '' }`}>
                <Label>Brand</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={ loadBrands }
                  onChange={ onHandleBrandChange }
                  value={state.brand}
                />
                <div className="invalid-feedback">{ state.errors.brand !== undefined ? state.errors.brand : '' }</div>
              </div>
            </Col> }
            { state.type.value === 'product' && <Col lg='6' md='12'>
              <div className={`mb-2 select-wrapper ${ state.errors.product !== undefined ? 'has-error' : '' }`}>
                <Label>Product</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={ loadProducts }
                  onChange={ onHandleProductChange }
                  value={state.product}
                />
                <div className="invalid-feedback">{ state.errors.product !== undefined ? state.errors.product : '' }</div>
              </div>
            </Col> }
            { state.type.value === 'externalUrl' && <Col lg='6' md='12'>
              <div className={`mb-2 select-wrapper ${ state.errors.externalUrl !== undefined ? 'has-error' : '' }`}>
                <Label>External Url</Label>
                <Input placeholder='External Url...' onChange={ e => setState({ ...state, externalUrl: e.target.value }) } invalid={ state.errors.externalUrl !== undefined } />
                <div className="invalid-feedback">{ state.errors.externalUrl !== undefined ? state.errors.externalUrl : '' }</div>
              </div>
            </Col> }
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Status</Label>
                <Select
                  cacheOptions
                  defaultOptions
                  value={state.status}
                  options={state.statusAll}
                  onChange={ selectedStatus => setState({ ...state, status: selectedStatus }) }
                />
                <div className="invalid-feedback">{ state.errors.type !== undefined ? state.errors.type : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Order</Label>
                <Input type={"number"} placeholder='Order...' onChange={ e => setState({ ...state, order: e.target.value }) } invalid={ state.errors.order !== undefined } value={state.order} />
                <div className="invalid-feedback">{ state.errors.order !== undefined ? state.errors.order : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='12' md='12'>
              <Button color='relief-primary' onClick={ onUpdate }>Update</Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default MenusEdit