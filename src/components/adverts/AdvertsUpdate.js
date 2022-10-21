import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Label, Button, Alert } from 'reactstrap'
import Select from 'react-select'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import useToast from '../../hooks/toast'
import AsyncSelect from 'react-select/async'
import MapChoose from '../map/mapChoose'
import UploaderItem from '../uploaderBox/UploaderItem'
import UploaderBox from '../uploaderBox/UploaderBox.js'

const AdvertsUpdate = ({ defaultInfo, onUpdated, onCancel }) => {
  const {users, adverts, categories, cities} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const [isSaveClicked, setIsSaveClicked] = useState(false)
  const [state, setState] = useState({
    title: "",
    category: null,
    cities: [],
    city: null,
    users: [],
    user: null,
    selectedImages: [],
    selectedArea: "",
    selectedAttributes: [],
    areas: [],
    description: "",
    marker: null,
    mapZoom: 13,
    price: null,
    priceRahn: null,
    priceEjare: null,
    status: { label: 'فعال', value: 'active' }
  })
  const {toastError, toastSuccess} = useToast()

  useEffect(() => {
    if (defaultInfo === undefined || defaultInfo === null) {
      return
    }
    let status = null
    switch (defaultInfo.status) {
      case "pending":
        status = { label: 'در انتظار تایید', value: 'pending' }
        break
      case "active":
        status = { label: 'فعال', value: 'active' }
        break
      case "rejected":
        status = { label: 'رد شده', value: 'rejected' }
        break
    }
    try {
      setState({
        ...state,
        title: defaultInfo.title,
        category: {
          label: defaultInfo.category.parent.title + " - " + defaultInfo.category.title,
          value: defaultInfo.category._id,
          attributes: defaultInfo.category.attributes,
          slug: defaultInfo.category.parent.slug
        },
        city: {
          label: defaultInfo.city.title,
          value: defaultInfo.city._id,
          lat: defaultInfo.city.lat,
          lng: defaultInfo.city.lng
        },
        user: {
          label: defaultInfo.user.name + " " + defaultInfo.user.family + (defaultInfo.user.mobile === undefined ? "" : "(" + defaultInfo.user.mobile + ")"),
          value: defaultInfo.user._id
        },
        selectedArea: defaultInfo.area,
        description: defaultInfo.description,
        marker: defaultInfo.lat === null ? null : {
          lat: defaultInfo.lat,
          lng: defaultInfo.lng
        },
        mapZoom: 13,
        price: defaultInfo.price,
        priceRahn: defaultInfo.priceRahn,
        priceEjare: defaultInfo.priceEjare,
        status
      })
      setErrors({})
    } catch (e) {}
  }, [defaultInfo])

  const validateFields = async _ => {
    const errs = await validate(state, {
      user: [{name: 'required'}],
      title: [{name: 'required'}],
      category: [{name: 'required'}],
      city: [{name: 'required'}]
    })
    setErrors(errs)
    return errs
  }

  useEffect(async () => {
    if (isSaveClicked) {
      await validateFields()
    }
  }, [state])

  const onUpdate = async () => {
    if (!isSaveClicked) {
      setIsSaveClicked(true)
    }
    const formErrors = await validateFields()
    if (Object.keys(formErrors).length > 0) {
      return
    }
    try {
      const response = await adverts.update(defaultInfo._id, {
        user: state.user !== null ? state.user.value : null,
        title: state.title,
        description: state.description,
        city: state.city.value,
        category: state.category !== null ? state.category.value : null,
        area: state.selectedArea,
        images: state.selectedImages,
        lat: state.marker === null ? null : state.marker.lat,
        lng: state.marker === null ? null : state.marker.lng,
        price: state.price,
        priceRahn: state.priceRahn,
        priceEjare: state.priceEjare,
        attributes: state.selectedAttributes.map(item => {
          return {
            attribute: item.attribute._id,
            value: item.value
          }
        }),
        status: state.status !== null ? state.status.value : null
      })
      if (response.data.statusCode === 200) {
        onUpdated(response)
        setErrors({})
        setIsSaveClicked(false)
        toastSuccess("تغییرات با موفقیت ثبت گردید")
      } else {
        toastError(response.data.message)
      }
    } catch (e) {
      if (e.response.status === 400) {
        toastError(e.response.data.message[0])
      }
    }
  }

  const onHandleCategoryChange = (selected) => {
    setState({ 
      ...state,
      category: selected
    })
  }

  const loadCategories = async (inputValue, callback) => {
    const response = await categories.fetchParents()
    let options = response.data.result.map(item => {
      return {
        label: item.title,
        options: item.children.map(children => {
          return {
            label: item.title + " - " + children.title,
            value: children._id,
            attributes: children.attributes,
            slug: item.slug
          }
        })
      }
    })
    if (inputValue !== '') {
      options = options.filter(item => item.label.toLowerCase().includes(inputValue.toLowerCase()))
    }
    return options
  }

  const onHandleCityChange = (selected) => {
    const cities = state.cities
    const city = cities.find(city => city._id === selected.value)
    const areas = city?.areas ?? []

    setState({
      ...state,
      city: selected,
      selectedArea: "",
      areas
    })
  }

  const loadCities = async (inputValue, callback) => {
    const response = await cities.fetchAll()
    const options = response.data.result.map(item => {
      return {
        value: item._id,
        label: item.title,
        lat: item.lat,
        lng: item.lng
      }
    })
    if (inputValue !== '') {
      options = options.filter(item => item.label.toLowerCase().includes(inputValue.toLowerCase()))
    }
    return options
  }

  const onChangeArea = async (selected) => {
    setState({
      ...state,
      selectedArea: selected.value
    })
  }

  const onChangeAttribute = (selected, attribute) => {
    let selectedAttributes = [...state.selectedAttributes]
    const index = selectedAttributes.findIndex(selectedAttribute => selectedAttribute.attribute._id === attribute._id)
    if (index > -1) {
        selectedAttributes[index] = {
            ...selectedAttributes[index],
            value: selected.value
        }
    } else {
        selectedAttributes = [
            ...selectedAttributes,
            {
                attribute,
                value: selected.value
            }
        ]
    }
    setState({
        ...state,
        selectedAttributes
    })
  }

  const findSelectedAttribute = (attribute) => {
    return state.selectedAttributes.find(selectedAttribute => selectedAttribute.attribute._id === attribute._id)
  }

  const onChangeMarker = (marker, zoom) => {
    setState({
      ...state,
      marker,
      mapZoom: zoom
    })
  }

  const onHandleUserChange = (selected) => {
    setState({ 
      ...state,
      user: selected
    })
  }

  const loadUsers = async (inputValue, callback) => {
    const response = await users.fetchAll()
    const options = response.data.result.map(item => {
      return {
        value: item._id,
        label: item.name + " " + item.family + (item.mobile === undefined ? "" : " (" + item.mobile + ")")
      }
    })
    if (inputValue !== '') {
      options = options.filter(item => item.label.toLowerCase().includes(inputValue.toLowerCase()))
    }
    return options
  }

  const onChangeFiles = (files) => {
    if (files.length <= 0) {
        return
    }
    setState({
        ...state,
        selectedImages: [...state.selectedImages, ...Array.from(files)]
    })
  }

  const onRemoveImage = (index) => {
    const selectedImages = [...state.selectedImages]
    selectedImages.splice(index, 1)
    setState({
      ...state,
      selectedImages: [...selectedImages]
    })
  }

  const onSetMainImage = (index) => {
    let selectedImages = [...state.selectedImages]
    const image = selectedImages[index]
    selectedImages.splice(index, 1)
    selectedImages = [image, ...selectedImages]
    setState({
      ...state,
      selectedImages: [...selectedImages]
    })
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>ویرایش آگهی</span>
            <div className='actions'>
              <Button color='relief-primary' onClick={ onUpdate }>ویرایش</Button>&nbsp;
              <Button color='relief-danger' onClick={ onCancel }>لغو</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
        <Row>
            <Col lg='12' md='12'>
              <div className={`mb-2 row select-wrapper ${ errors.user !== undefined ? 'has-error' : '' }`}>
                <Label>انتخاب آگهی دهنده</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  placeholder="انتخاب آگهی دهنده"
                  value={state.user}
                  loadOptions={loadUsers}
                  onChange={onHandleUserChange}
                />
                <div className="invalid-feedback">{ errors.user !== undefined ? errors.user : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>عنوان</Label>
                <Input placeholder='عنوان...' autoComplete='off' value={state.title} onChange={ e => setState({ ...state, title: e.target.value }) } invalid={ errors.title !== undefined } />
                <div className="invalid-feedback">{ errors.title !== undefined ? errors.title : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className={`mb-2 row select-wrapper ${ errors.category !== undefined ? 'has-error' : '' }`}>
                <Label>انتخاب دسته بندی</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  placeholder="انتخاب دسته بندی"
                  value={state.category}
                  loadOptions={loadCategories}
                  onChange={onHandleCategoryChange}
                />
                <div className="invalid-feedback">{ errors.category !== undefined ? errors.category : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className={`mb-2 row select-wrapper ${ errors.city !== undefined ? 'has-error' : '' }`}>
                <Label>انتخاب شهر</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  placeholder="انتخاب شهر"
                  value={state.city}
                  loadOptions={loadCities}
                  onChange={onHandleCityChange}
                />
                <div className="invalid-feedback">{ errors.city !== undefined ? errors.city : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className={`mb-2 row select-wrapper ${ errors.city !== undefined ? 'has-error' : '' }`}>
                <Label>انتخاب محدوده</Label>
                <Select 
                  id={"selectArea"}
                  instanceId={"selectArea"}
                  placeholder="محدوده آگهی"
                  options={state.areas.map(area => {
                      return { label: area, value: area }
                  })} 
                  onChange={onChangeArea}
                  value={state.selectedArea === "" ? null : { label: state.selectedArea, value: state.selectedArea }}
                />
                <div className="invalid-feedback">{ errors.area !== undefined ? errors.area : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="12" md="12" className='mb-15'>
              <Label>انتخاب روی نقشه</Label>
              <MapChoose
                marker={state.marker}
                city={state.city}
                onChangeMarker={onChangeMarker}
                zoom={state.mapZoom}
              />
            </Col>
          </Row>
          <Row>
            <Col lg="12" md="12">
              <div className="flex">
                {state.selectedImages.map((image, index) => <UploaderItem 
                    key={`uploaderItem${index}`} 
                    src={window.URL.createObjectURL(image)} 
                    index={index} 
                    onRemove={onRemoveImage}
                    onSetMainImage={onSetMainImage}
                />)}
                <UploaderBox id="advertbox" onChange={onChangeFiles} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="12" md="12" className='mb-15'>
              {(state.category !== null && state.category.slug.indexOf('فروش') > -1) && <div className='mb-2'>
                <Label>قیمت کل</Label>
                <Input type='text' autoComplete='off' placeholder='قیمت کل...' value={state.price} onChange={ e => setState({ ...state, price: e.target.value }) } invalid={ errors.price !== undefined } />
                <div className="invalid-feedback">{ errors.price !== undefined ? errors.price : '' }</div>
              </div>}
              {(state.category !== null && state.category.slug.indexOf('اجاره') > -1) && <div className="vadie-ejare">
                <div className='mb-2'>
                  <Label>ودیعه</Label>
                  <Input type='text' autoComplete='off' placeholder='ودیعه...' value={state.priceRahn} onChange={ e => setState({ ...state, priceRahn: e.target.value }) } invalid={ errors.priceRahn !== undefined } />
                  <div className="invalid-feedback">{ errors.priceRahn !== undefined ? errors.priceRahn : '' }</div>
                </div>
                <div className='mb-2'>
                  <Label>اجاره ماهیانه</Label>
                  <Input type='text' autoComplete='off' placeholder='اجاره ماهیانه...' value={state.priceEjare} onChange={ e => setState({ ...state, priceEjare: e.target.value }) } invalid={ errors.priceEjare !== undefined } />
                  <div className="invalid-feedback">{ errors.priceEjare !== undefined ? errors.priceEjare : '' }</div>
                </div>
              </div>}
            </Col>
          </Row>
          <Row>
            <Col lg='12' md='12' className='mb-15'>
              {state.category?.attributes && state.category?.attributes.length > 0 && <div>
                <div className="grid grid-template-columns2">
                  {state.category?.attributes.map((attribute) => <div key={attribute._id} className="flex">
                    <div className="select-wrapper flex-1">
                      <Label>{attribute.title}</Label>
                      <Select 
                        id={`selectPossibleValue${attribute._id}`}
                        instanceId={`selectPossibleValue${attribute._id}`}
                        placeholder={attribute.title}
                        options={attribute.possibleValues.map((possibleValue) => {
                          return { label: possibleValue, value: possibleValue }
                        })}
                        onChange={(selected) => onChangeAttribute(selected, attribute)}
                        value={findSelectedAttribute(attribute) !== undefined ? { label: findSelectedAttribute(attribute)?.value, value: findSelectedAttribute(attribute)?.value } : null}
                      />
                    </div>
                  </div>)}
                </div>
              </div>}
            </Col>
          </Row>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>توضیحات</Label>
                <Input type='textarea' autoComplete='off' placeholder='توضیحات...' value={state.description} onChange={ e => setState({ ...state, description: e.target.value }) } invalid={ errors.description !== undefined } />
                <div className="invalid-feedback">{ errors.description !== undefined ? errors.description : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>وضعیت</Label>
                <Select
                  cacheOptions
                  defaultOptions
                  value={state.status}
                  options={[
                    { label: 'در انتظار تایید', value: 'pending' },
                    { label: 'فعال', value: 'active' },
                    { label: 'رد شده', value: 'rejected' }
                  ]}
                  onChange={ selected => setState({ ...state, status: selected }) }
                />
                <div className="invalid-feedback">{ errors.status !== undefined ? errors.status : '' }</div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default AdvertsUpdate