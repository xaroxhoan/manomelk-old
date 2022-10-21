import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Card, CardHeader, CardBody, CardTitle, Label, Button, Alert } from 'reactstrap'
import Select from 'react-select'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import AsyncCreatableSelect from 'react-select/async-creatable'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw, EditorState, ContentState, convertFromHTML } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import useToast from '../../hooks/toast'

const FaqUpdate = ({ defaultInfo, onUpdated, onCancel }) => {
  const {faq, faqtopic} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const [isInitialLoaded, setIsInitialLoaded] = useState(false)
  const [state, setState] = useState({
    title: '',
    description: '',
    sort: 0,
    status: { label: 'فعال', value: 'enabled' },
    updateCounter: 0
  })
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const {toastError, toastSuccess} = useToast()
  const [topicState, setTopicState] = useState({
    isLoading: false,
    options: [],
    topic: undefined
  })

  useEffect(() => {
    if (defaultInfo === null) {
      return
    }
    try {
      setState({
        ...state,
        title: defaultInfo.title,
        description: defaultInfo.description,
        sort: defaultInfo.sort,
        updateCounter: 0,
        status: { label: (defaultInfo.status === "enabled" ? "فعال" : "غیرفعال"), value: defaultInfo.status }
      })
      setTopicState({
        ...topicState,
        topic: {
          value: defaultInfo.topic._id,
          label: defaultInfo.topic.title
        }
      })
      setEditorState(() => EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(defaultInfo.description))))
      setErrors({})
    } catch (e) {}
  }, [defaultInfo])

  const validateFields = async _ => {
    const errs = await validate(state, {
      title: [{name: 'required'}],
      sort: [{name: 'required'}, {name: 'number'}],
      description: [{name: 'required'}]
    })
    const errs2 = await validate(topicState, {
      topic: [{name: 'required'}]
    })
    setErrors({...errs, ...errs2})
    return errs
  }

  useEffect(() => {
    setIsInitialLoaded(true)
  }, [])

  useEffect(async () => {
    if (isInitialLoaded) {
      await validateFields()
    }
  }, [state, topicState])

  const onUpdate = async () => {
    try {
      const formErrors = await validateFields()
      if (Object.keys(formErrors).length > 0) {
        return
      }
      const response = await faq.update(defaultInfo._id, {
        topic: topicState.topic === undefined ? null : topicState.topic.value,
        title: state.title,
        sort: parseInt(state.sort),
        description: state.description,
        status: state.status.value
      })
      onUpdated(response)
      setErrors({})
      if (response.data.statusCode === 200) {
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

  const loadTopicOptions = async inputValue => {
    const response = await faqtopic.fetchAll()
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

  const handleTopicCreate = async title => {
      setTopicState({ ...topicState, isLoading: true })
      const response = await faqtopic.store({ title })
      const createdTopic = response.data.result
      const newOption = {
        value: createdTopic._id,
        label: createdTopic.title
      }
      setTopicState({
        ...topicState, 
        isLoading: false,
        options: [
          ...topicState.options, 
          newOption
        ],
        topic: newOption
      })
  }

  const handleTopicChange = newValue => {
      setTopicState({
        ...topicState, 
        topic: newValue
      })
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>ویرایش سوال متداول</span>
            <div className='actions'>
              <Button color='relief-primary' onClick={ onUpdate }>ویرایش</Button>&nbsp;
              <Button color='relief-danger' onClick={ onCancel }>لغو</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2 has-error'>
                  <Label>گروه</Label>
                  <AsyncCreatableSelect
                      key={topicState.options.length + state.updateCounter}
                      cacheOptions
                      defaultOptions
                      isClearable
                      loadOptions={loadTopicOptions}
                      isDisabled={topicState.isLoading}
                      isLoading={topicState.isLoading}
                      onChange={handleTopicChange}
                      onCreateOption={handleTopicCreate}
                      value={topicState.topic}
                  />
                  <div className="invalid-feedback">{ errors.topic !== undefined ? errors.topic : '' }</div>
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
            <Col lg='12' md='12'>
              <div className='mb-2'>
                <Label>اولویت</Label>
                <Input placeholder='اولویت...' value={state.sort} onChange={ e => setState({ ...state, sort: e.target.value }) } invalid={ errors.sort !== undefined } />
                <div className="invalid-feedback">{ errors.sort !== undefined ? errors.sort : '' }</div>
              </div>
            </Col>
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
            <Col lg='6' md='12'>
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

export default FaqUpdate