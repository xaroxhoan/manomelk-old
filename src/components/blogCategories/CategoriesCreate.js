import { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, CardTitle, Input, Label, Row, Col, Button } from 'reactstrap'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import useToast from '../../hooks/toast'

const CategoriesCreate = ({ onSaved, onCancel }) => {
  const service = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const [isSaveClicked, setIsSaveClicked] = useState(false)
  const [state, setState] = useState({
    title: '',
    parent: null,
    status: { label: 'فعال', value: 'enabled' }
  })
  const {toastError, toastSuccess} = useToast()

  const validateFields = async _ => {
    const errs = await validate(state, {
      title: [{name: 'required'}]
    })
    setErrors(errs)
    return errs
  }

  useEffect(async () => {
    if (isSaveClicked) {
      await validateFields()
    }
  }, [
    state.title
  ])

  const onSave = async () => {
    try {
      if (!state.isSaveClicked) {
        setIsSaveClicked(true)
      }
      const formErrors = await validateFields()
      if (Object.keys(formErrors).length > 0) {
        return
      }
      const response = await service.blog.categories.store({
        title: state.title,
        parent: state.parent !== null ? state.parent.value : null,
        status: state.status.value
      })
      if (response.data.statusCode === 200) {
        onSaved(response)
        setErrors({})
        setIsSaveClicked(false)
        setState({ 
          ...state,
          title: '',
          parent: null
        })
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

  const onHandleCategoryChange = (value) => {
    setState({ 
      ...state,
      parent: value
    })
  }

  const loadCategories = async (inputValue, callback) => {
    const response = await service.blog.categories.fetchAll()
    let options = response.data.result.map(item => {
      return {
        value: item._id,
        label: item.title
      }
    })
    if (inputValue !== '') {
        options = options.filter(item => item.label.toLowerCase().includes(inputValue.toLowerCase()))
    }
    return options
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>دسته جدید</span>
            <div className='actions'>
              <Button color='relief-primary' onClick={ onSave }>ثبت</Button>&nbsp;
              <Button color='relief-danger' onClick={ onCancel }>لغو</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>عنوان</Label>
                <Input placeholder='عنوان...' onChange={ e => setState({ ...state, title: e.target.value }) } invalid={ errors.title !== undefined } />
                <div className="invalid-feedback">{ errors.title !== undefined ? errors.title : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>دسته والد</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  placeholder="دسته والد"
                  loadOptions={ loadCategories }
                  value={state.parent}
                  onChange={ onHandleCategoryChange }
                />
                <div className="invalid-feedback">{ errors.parent !== undefined ? errors.parent : '' }</div>
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
                    { label: 'فعال', value: 'enabled' },
                    { label: 'غیرفعال', value: 'disabled' }
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

export default CategoriesCreate
