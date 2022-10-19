import React, { useContext, useState, useEffect } from 'react'
import { Row, Col, Card, CardHeader, CardBody, CardTitle, Label, Button, Alert } from 'reactstrap'
import BlogContext from '../../context/BlogContext'
import { Editor } from 'react-draft-wysiwyg'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import useService from '../../hooks/service'
import useValidator from '../../hooks/velidator'
import BoxAlert from '@appcomponents/alert/BoxAlert'

const OfficialRetailer = () => {
  const {setting} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const {validate} = useValidator()
  const {state, setState, resetState} = useContext(BlogContext)
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [isSaveClicked, setIsSaveClicked] = useState(false)

  const validateFields = async _ => {
    const errs = await validate(state, {
      description: [{name: 'required'}]
    })
    setErrors(errs)
    return errs
  }
  
  useEffect(async () => {
    try {
      const response = await setting.getByGroupAndKey('undermenu', 'officialRetailer')
      const defaultInfo = response.data.data.value
      setState({
        description: defaultInfo,
        successMessage: ''
      })
      setEditorState(() => EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(defaultInfo))))
      setErrors({})
    } catch (e) {}
  }, [])

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
      const response = await setting.store('undermenu', 'officialRetailer', state.description)
      setIsSaveClicked(false)
      setState({ ...state, successMessage: response.data.message.message })
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
            <span>Official Retailer</span>
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
                    editorClassName="texteditor-500" />
                </div>
                <div className="invalid-feedback">{ errors.description !== undefined ? errors.description : '' }</div>
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
    description: '',
    successMessage: ''
  }
  const [state, setState] = useState(initialState)
  const resetState = _ => setState(initialState)
  return <BlogContext.Provider value={{ state, setState, resetState }}>
    <OfficialRetailer {...props} />
  </BlogContext.Provider>
}