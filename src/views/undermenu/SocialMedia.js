import React, { useState, useEffect } from 'react'
import { Row, Col, Card, CardHeader, CardBody, CardTitle, Label, Button, Input } from 'reactstrap'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import useService from '../../hooks/service'
import BoxAlert from '@appcomponents/alert/BoxAlert'

const SocialMedia = () => {
  const {setting} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState({
    linkedin: "",
    twitter: "",
    instagram: "",
    successMessage: ""
  })
  
  useEffect(async () => {
    try {
      setLoading(true)
      const linkedinResponse = await setting.getByGroupAndKey('social', 'linkedin')
      const twitterResponse = await setting.getByGroupAndKey('social', 'twitter')
      const instagramResponse = await setting.getByGroupAndKey('social', 'instagram')
      const linkedin = linkedinResponse.data.data.value
      const twitter = twitterResponse.data.data.value
      const instagram = instagramResponse.data.data.value

      setState({
        ...state,
        linkedin,
        twitter,
        instagram,
        successMessage: ""
      })
      setErrors({})
      setLoading(false)
    } catch (e) {}
  }, [])


  const onSave = async () => {
    try {
      const response = await setting.storeMultiple('social', {
        linkedin: state.linkedin,
        twitter: state.twitter,
        instagram: state.instagram
      })
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
          <Row className='fullwidth'>
            <Col lg='6' md='12' className='p-r-0'>
              <CardTitle className='has-action'>
                <span>Social Media</span>
                <div className='actions'>
                  <Button color='relief-primary' onClick={ onSave }>Save</Button>
                </div>
              </CardTitle>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <BoxAlert type='success' visible={state.successMessage !== ''}>
            { state.successMessage }
          </BoxAlert>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Linked In</Label>
                <Input type='linkedin' placeholder='linkedin...' value={state.linkedin} onChange={ e => setState({ ...state, linkedin: e.target.value }) } invalid={ errors.linkedin !== undefined } /> &nbsp;
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Twitter</Label>
                <Input type='twitter' placeholder='twitter...' value={state.twitter} onChange={ e => setState({ ...state, twitter: e.target.value }) } invalid={ errors.twitter !== undefined } /> &nbsp;
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>Instagram</Label>
                <Input type='instagram' placeholder='instagram...' value={state.instagram} onChange={ e => setState({ ...state, instagram: e.target.value }) } invalid={ errors.instagram !== undefined } /> &nbsp;
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default SocialMedia