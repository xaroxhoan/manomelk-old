import { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, CardTitle, Input, Label, Row, Col, Button, Alert } from 'reactstrap'
import AsyncSelect from 'react-select/async'
import UploaderModal from '../upload/UploaderModal'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import BoxAlert from '@appcomponents/alert/BoxAlert'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw, EditorState, ContentState, convertFromHTML } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'

const CategoriesUpdate = ({ onUpdated, defaultInfo, onCancel }) => {
  const service = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const [isInitialLoaded, setIsInitialLoaded] = useState(false)
  const [state, setState] = useState({
    title: '',
    description: '',
    keywords: '',
    canonicalUrl: '',
    sitemapPriority: '',
    sitemapFrequency: '',
    alias: '',
    image: null,
    successMessage: ''
  })

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

  useEffect(() => {
    if (defaultInfo === null) {
      return
    }
    setState({
      ...state,
      title: defaultInfo.title,
      description: defaultInfo.description,
      keywords: defaultInfo.keywords,
      canonicalUrl: defaultInfo.canonicalUrl,
      sitemapPriority: defaultInfo.sitemapPriority,
      sitemapFrequency: defaultInfo.sitemapFrequency,
      alias: defaultInfo.alias,
      image: defaultInfo.image !== undefined && defaultInfo.image !== null ? defaultInfo.image : null,
      successMessage: ''
    })
    setEditorState(() => EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(defaultInfo.description))))
    setErrors({})
  }, [defaultInfo])
  
  const validateFields = async _ => {
    const errs = await validate(state, {
      title: [{name: 'required'}],
      description: [{name: 'required'}],
      keywords: [{name: 'required'}],
      canonicalUrl: [{name: 'required'}, {name: 'url'}],
      sitemapPriority: [{name: 'required'}],
      sitemapFrequency: [{name: 'required'}],
      alias: [{name: 'required'}, {name: 'unique', model: 'ArticleCategory', conditions: {alias: state.alias}, exceptIds: [defaultInfo._id]}],
      image: [{name: 'required'}]
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
    state.title,
    state.description,
    state.keywords,
    state.canonicalUrl,
    state.sitemapPriority,
    state.sitemapFrequency,
    state.alias,
    state.image
  ])

  const onUpdate = async () => {
    try {
      const formErrors = await validateFields()
      if (Object.keys(formErrors).length > 0) {
        return
      }
      const response = await service.articleCategories.update(defaultInfo._id, {
        id: defaultInfo._id,
        title: state.title,
        description: state.description,
        keywords: state.keywords,
        canonicalUrl: state.canonicalUrl,
        sitemapFrequency: state.sitemapFrequency,
        sitemapPriority: state.sitemapPriority,
        alias: state.alias,
        image: state.image !== null ? state.image._id : null
      })
      onUpdated(response)
      setState({ 
        ...state,
        successMessage: response.data.message.message 
      })
      setErrors({})
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

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>Update Article Category</span>
            <div className='actions'>
              <Button color='relief-primary' onClick={ onUpdate }>Update</Button>&nbsp;
              <Button color='relief-danger' onClick={ onCancel }>Cancel</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <BoxAlert type='success' visible={state.successMessage !== ''}>
            { state.successMessage }
          </BoxAlert>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Title</Label>
                <Input placeholder='Title...' value={ state.title } onChange={ e => setState({ ...state, title: e.target.value }) } invalid={ errors.title !== undefined } />
                <div className="invalid-feedback">{ errors.title !== undefined ? errors.title : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Canonical Url</Label>
                <Input placeholder='Canonical Url...' value={ state.canonicalUrl } onChange={ e => setState({ ...state, canonicalUrl: e.target.value }) } invalid={ errors.canonicalUrl !== undefined } />
                <div className="invalid-feedback">{ errors.canonicalUrl !== undefined ? errors.canonicalUrl : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Keywords</Label>
                <Input placeholder='Keywords...' value={ state.keywords } onChange={ e => setState({ ...state, keywords: e.target.value }) } invalid={ errors.keywords !== undefined } />
                <div className="invalid-feedback">{ errors.keywords !== undefined ? errors.keywords : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Sitemap Frequency</Label>
                <Input placeholder='Sitemap Frequency...' value={ state.sitemapFrequency } onChange={ e => setState({ ...state, sitemapFrequency: e.target.value }) } invalid={ errors.sitemapFrequency !== undefined } />
                <div className="invalid-feedback">{ errors.sitemapFrequency !== undefined ? errors.sitemapFrequency : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Sitemap Priority</Label>
                <Input placeholder='Sitemap Priority...' value={ state.sitemapPriority } onChange={ e => setState({ ...state, sitemapPriority: e.target.value }) } invalid={ errors.sitemapPriority !== undefined } />
                <div className="invalid-feedback">{ errors.sitemapPriority !== undefined ? errors.sitemapPriority : '' }</div>
              </div>
            </Col>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Alias</Label>
                <Input placeholder='Alias...' value={ state.alias } onChange={ e => setState({ ...state, alias: e.target.value }) } invalid={ errors.alias !== undefined } />
                <div className="invalid-feedback">{ errors.alias !== undefined ? errors.alias : '' }</div>
              </div>
            </Col>
          </Row>
          <Row>
            {/* <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>Description</Label>
                <Input placeholder='Description...' value={ state.description } onChange={ e => setState({ ...state, description: e.target.value }) } invalid={ errors.description !== undefined } />
                <div className="invalid-feedback">{ errors.description !== undefined ? errors.description : '' }</div>
              </div>
            </Col> */}
            <Col lg={12} md={12}>
              <div className={`mb-2 row box-editor-wrapper ${ errors.description !== undefined ? 'has-error' : '' }`}>
                <Label>Description</Label>
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
              <div className={`mb-2 ${errors.image !== undefined ? 'has-error' : ''}`}>
                <Label>Image</Label>
                <UploaderModal
                  defaultSelected={state.image} 
                  onChooseItem={item => setState({ ...state, image: item })}
                />
                <div className="invalid-feedback">{ errors.image !== undefined ? errors.image : '' }</div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default CategoriesUpdate
