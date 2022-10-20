import React, { useState, useEffect } from 'react'
import { Row, Col, Card, CardHeader, CardBody, CardTitle, Label, Button, Input, Alert } from 'reactstrap'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import useService from '../../hooks/service'
import BoxAlert from '@appcomponents/alert/BoxAlert'
import useToast from '../../hooks/toast'

const SocialMedia = () => {
  const {setting} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState({
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
    youtube: ""
  })
  const {toastError, toastSuccess} = useToast()
  
  useEffect(async () => {
    try {
      setLoading(true)
      const linkedinResponse = await setting.getByGroupAndKey('social', 'linkedin')
      const twitterResponse = await setting.getByGroupAndKey('social', 'twitter')
      const instagramResponse = await setting.getByGroupAndKey('social', 'instagram')
      const facebookResponse = await setting.getByGroupAndKey('social', 'facebook')
      const youtubeResponse = await setting.getByGroupAndKey('social', 'youtube')
      const linkedin = linkedinResponse.data.result.value
      const twitter = twitterResponse.data.result.value
      const instagram = instagramResponse.data.result.value
      const facebook = facebookResponse.data.result.value
      const youtube = youtubeResponse.data.result.value

      setState({
        ...state,
        linkedin,
        twitter,
        instagram,
        facebook,
        youtube
      })
      setErrors({})
      setLoading(false)
    } catch (e) {}
  }, [])


  const onSave = async () => {
    try {
      const response = await setting.storeMultiple('social', [
        {
          key: "linkedin",
          value: state.linkedin
        },
        {
          key: "twitter",
          value: state.twitter
        },
        {
          key: "instagram",
          value: state.instagram
        },
        {
          key: "facebook",
          value: state.facebook
        },
        {
          key: "youtube",
          value: state.youtube
        }
      ])
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

  return (
    <div>
      <Card>
        <CardHeader>
          <Row className='fullwidth'>
            <Col lg='6' md='12' className='p-r-0'>
              <CardTitle className='has-action'>
                <span>شبکه های اجتماعی</span>
                <div className='actions'>
                  <Button color='relief-primary' onClick={ onSave }>ثبت</Button>
                </div>
              </CardTitle>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg="6" md="12">
              <Alert color="warning" className="px-10 py-10 font-bold">توجه: اگر مقدار فیلدها را خالی ثبت کنید در سایت نشان داده نمی شوند</Alert>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>لینکدین</Label>
                <Input type='linkedin' placeholder='لینکدین...' value={state.linkedin} onChange={ e => setState({ ...state, linkedin: e.target.value }) } invalid={ errors.linkedin !== undefined } /> &nbsp;
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>توییتر</Label>
                <Input type='twitter' placeholder='توییتر...' value={state.twitter} onChange={ e => setState({ ...state, twitter: e.target.value }) } invalid={ errors.twitter !== undefined } /> &nbsp;
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>اینستاگرام</Label>
                <Input type='instagram' placeholder='اینستاگرام...' value={state.instagram} onChange={ e => setState({ ...state, instagram: e.target.value }) } invalid={ errors.instagram !== undefined } /> &nbsp;
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>فیسبوک</Label>
                <Input type='facebook' placeholder='فیسبوک...' value={state.facebook} onChange={ e => setState({ ...state, facebook: e.target.value }) } invalid={ errors.facebook !== undefined } /> &nbsp;
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>یوتیوب</Label>
                <Input type='youtube' placeholder='یوتیوب...' value={state.youtube} onChange={ e => setState({ ...state, youtube: e.target.value }) } invalid={ errors.youtube !== undefined } /> &nbsp;
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default SocialMedia