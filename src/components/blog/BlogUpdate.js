import { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, CardTitle, Input, Label, Row, Col, Button } from 'reactstrap'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import useToast from '../../hooks/toast'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw, EditorState, ContentState, convertFromHTML } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'

const BlogUpdate = ({ onUpdated, defaultInfo, onCancel }) => {
  const service = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const [isInitialLoaded, setIsInitialLoaded] = useState(false)
  const [state, setState] = useState({
    title: "",
    category: null,
    description: "",
    status: { label: 'فعال', value: 'enabled' }
  })
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const {toastError, toastSuccess} = useToast()

  useEffect(() => {
    try {
      if (defaultInfo === null) {
        return
      }
      setState({
        ...state,
        title: defaultInfo.title,
        description: defaultInfo.text,
        category: defaultInfo.category !== undefined && defaultInfo.category !== null ? {label: defaultInfo.category.title, value: defaultInfo.category._id} : null,
        status: {label: (defaultInfo.status === "enabled" ? "فعال" : "غیرفعال"), value: defaultInfo.status}
      })
      setEditorState(() => EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(defaultInfo.text))))
      setErrors({})
    } catch (e) {}
  }, [defaultInfo])
  
  const validateFields = async _ => {
    const errs = await validate(state, {
      title: [{name: 'required'}],
      category: [{name: 'required'}],
      description: [{name: 'required'}]
    })
    setErrors(errs)
    return errs
  }

  useEffect(() => {
    setIsInitialLoaded(true)
  }, [])

  useEffect(async () => {
    if (isInitialLoaded) {
      await validateFields()
    }
  }, [
    state.title
  ])

  const onUpdate = async () => {
    try {
      const formErrors = await validateFields()
      if (Object.keys(formErrors).length > 0) {
        return
      }
      const response = await service.blog.update(defaultInfo._id, {
        title: state.title,
        category: state.category !== null ? state.category.value : null,
        text: state.description,
        status: state.status.value
      })
      if (response.data.statusCode === 200) {
        onUpdated(response)
        setErrors({})
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
      category: value
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
            <span>ویرایش مقاله</span>
            <div className='actions'>
              <Button color='relief-primary' onClick={ onUpdate }>ویرایش</Button>&nbsp;
              <Button color='relief-danger' onClick={ onCancel }>لغو</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg='6' md='12'>
              <div className={`mb-2 row select-wrapper ${ errors.category !== undefined ? 'has-error' : '' }`}>
                  <Label>دسته</Label>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    placeholder="دسته"
                    loadOptions={ loadCategories }
                    value={state.category}
                    onChange={ onHandleCategoryChange }
                  />
                  <div className="invalid-feedback">{ errors.category !== undefined ? errors.category : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>عنوان</Label>
                <Input placeholder='عنوان...' value={state.title} onChange={ e => setState({ ...state, title: e.target.value }) } invalid={ errors.title !== undefined } />
                <div className="invalid-feedback">{ errors.title !== undefined ? errors.title : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12}>
              <div className={`mb-2 row box-editor-wrapper ${ errors.description !== undefined ? 'has-error' : '' }`}>
                <Label>توضیحات</Label>
                <div className='box-editor-content'>
                  <Editor 
                    editorState={editorState} 
                    onEditorStateChange={newEditorState => {
                      setEditorState(newEditorState) 
                      let description = draftToHtml(convertToRaw(newEditorState.getCurrentContent()))
                      description = description.trim().replace(/^<p>/i, '').replace(/<\/p>$/i, '')
                      setState({...state, description})
                    }} 
                    editorClassName="texteditor" 
                    toolbar={{
                      options: ['inline'],
                      inline: {
                        options: ['bold', 'italic', 'underline']
                      }
                  }}
                    />
                </div>
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

export default BlogUpdate
