import React, { useContext, useState, useEffect } from 'react'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Label, Button, Alert } from 'reactstrap'
import UploaderModal from '@appcomponents/upload/UploaderModal'
import Select from 'react-select'
import BlogContext from '../../context/BlogContext'
import AsyncSelect from 'react-select/async'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw, EditorState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import BoxAlert from '@appcomponents/alert/BoxAlert'
import { useHistory } from 'react-router-dom'

const BlogCreate = () => {
  const {blog, users} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const {state, setState, resetState} = useContext(BlogContext)
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [isSaveClicked, setIsSaveClicked] = useState(false)
  const history = useHistory()

  const validateFields = async _ => {
    const errs = await validate(state, {
      user: [{name: 'required'}],
      category: [{name: 'required'}],
      title: [{name: 'required'}],
      slug: [{name: 'required'}, {name: 'unique', model: 'Article', conditions: {slug: state.slug}}],
      description: [{name: 'required'}],
      image: [{name: 'required'}]
    })
    setErrors(errs)
    return errs
  }

  useEffect(async () => {
    if (isSaveClicked) {
      await validateFields()
    }
  }, [state])

  const onSave = async () => {
    try {
      if (!state.isSaveClicked) {
        setIsSaveClicked(true)
      }
      const formErrors = await validateFields()
      if (Object.keys(formErrors).length > 0) {
        return
      }
      const response = await blog.store({
        user: state.user !== null ? state.user.value : null,
        category: state.category !== null ? state.category.value : null,
        title: state.title,
        slug: state.slug,
        description: state.description,
        image: state.image !== null ? state.image._id : null,
        status: state.status.value
      })
      setErrors({})
      setIsSaveClicked(false)
      setState({
        user: null,
        category: null,
        title: '',
        slug: '',
        description: '',
        image: null,
        status: { label: 'Published', value: 'published' },
        successMessage: response.data.message.message 
      })
      history.push("/articles")
    } catch (e) {
      if (e.response.status === 422) {
        const errs = {}
        e.response.data.messages.forEach(item => {
          errs[item.field] = item.message
        })
        setState({ ...state, successMessage: '' })
        setErrors(errs)
      }
    }
  }

  const onHandleUserChange = (selected) => {
    setState({ 
      ...state,
      user: selected
    })
  }

  const loadUsers = async (inputValue, callback) => {
    const response = await users.fetchAll()
    return response.data.data.map(item => {
      return {
        value: item._id,
        label: item.name + " " + item.family + ` (${item.email})`
      }
    })
  }

  const onHandleArticleCategoryChange = (selected) => {
    setState({ 
      ...state,
      category: selected
    })
  }

  const loadArticleCategories = async (inputValue, callback) => {
    const response = await blog.categories.fetchAll()
    return response.data.data.map(item => {
      return {
        value: item._id,
        label: item.title
      }
    })
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>Create Article</span>
            <div className='actions'>
              <Button color='relief-primary' onClick={ onSave }>Save</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <BoxAlert type='success' visible={state.successMessage !== ''}>
            { state.successMessage }
          </BoxAlert>
          <Row>
            <Col lg='6' md='12'>
              <div className={`mb-2 row select-wrapper ${ errors.user !== undefined ? 'has-error' : '' }`}>
                <Label>User</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  value={state.user}
                  loadOptions={loadUsers}
                  onChange={onHandleUserChange}
                />
                <div className="invalid-feedback">{ errors.user !== undefined ? errors.user : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className={`mb-2 row select-wrapper ${ errors.category !== undefined ? 'has-error' : '' }`}>
                <Label>Category</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  value={state.category}
                  loadOptions={loadArticleCategories}
                  onChange={onHandleArticleCategoryChange}
                />
                <div className="invalid-feedback">{ errors.category !== undefined ? errors.category : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Title</Label>
                <Input placeholder='Title...' value={state.title} onChange={ e => setState({ ...state, title: e.target.value }) } invalid={ errors.title !== undefined } />
                <div className="invalid-feedback">{ errors.title !== undefined ? errors.title : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Slug</Label>
                <Input placeholder='Slug...' value={state.slug} onChange={ e => setState({ ...state, slug: e.target.value }) } invalid={ errors.slug !== undefined } />
                <div className="invalid-feedback">{ errors.slug !== undefined ? errors.slug : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12}>
              <div className={`mb-2 row box-editor-wrapper ${ errors.description !== undefined ? 'has-error' : '' }`}>
                <Label>Description</Label>
                <div className='box-editor-content'>
                  <Editor 
                    editorState={editorState} 
                    onEditorStateChange={newEditorState => {
                      setEditorState(newEditorState)
                      setState({...state, description: draftToHtml(convertToRaw(newEditorState.getCurrentContent()))})
                    }} 
                    editorClassName="texteditor" />
                </div>
                <div className="invalid-feedback">{ errors.description !== undefined ? errors.description : '' }</div>
              </div>
            </Col>
            <Col lg={12} md={12}>
              <div className={`mb-2 box-image-gallery-wrapper ${ errors.image !== undefined ? 'has-error' : '' }`}>
                <div>
                  <Label>Image</Label>
                  <UploaderModal 
                    onChooseItem={item => setState({ ...state, image: item })}
                  />
                </div>
                <div className="invalid-feedback">{ errors.image !== undefined ? errors.image : '' }</div>
              </div>
            </Col>
            <Col lg={12} md={12}>
              <div className='mb-2'>
                <Label>Status</Label>
                <Select
                  cacheOptions
                  defaultOptions
                  value={state.status}
                  options={[
                    { label: 'Published', value: 'published' },
                    { label: 'Unpublished', value: 'unpublished' },
                    { label: 'Draft', value: 'draft' }
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

export default props => {
  const initialState = {
    user: null,
    category: null,
    title: '',
    slug: '',
    description: '',
    image: null,
    status: { label: 'Published', value: 'published' },
    successMessage: ''
  }
  const [state, setState] = useState(initialState)
  const resetState = _ => setState(initialState)
  return <BlogContext.Provider value={{ state, setState, resetState }}>
    <BlogCreate {...props} />
  </BlogContext.Provider>
}