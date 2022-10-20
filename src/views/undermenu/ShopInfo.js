import React, { useState, useEffect } from 'react'
import { Row, Col, Card, CardHeader, CardBody, CardTitle, Label, Button, Input, Table } from 'reactstrap'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import useService from '../../hooks/service'
import BoxAlert from '@appcomponents/alert/BoxAlert'
import { Plus, Trash } from 'react-feather'
import useToast from '../../hooks/toast'

const ShopInfo = () => {
  const {setting} = useService()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState({
    info: "",
    infoes: [],
    address: ""
  })
  const {toastError, toastSuccess} = useToast()

  const isJson = (str) => {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }
  
  useEffect(async () => {
    try {
      setLoading(true)
      const infoesResponse = await setting.getByGroupAndKey('shopinfo', 'infoes')
      const addressResponse = await setting.getByGroupAndKey('shopinfo', 'address')
      const infoes = isJson(infoesResponse.data.result.value) ? JSON.parse(infoesResponse.data.result.value) : []
      const address = addressResponse.data.result.value

      setState({
        ...state,
        infoes,
        address
      })
      setErrors({})
      setLoading(false)
    } catch (e) {}
  }, [])


  const onSave = async () => {
    try {
      const response = await setting.storeMultiple('shopinfo', [
        {
          key: "infoes",
          value: JSON.stringify(state.infoes)
        },
        {
          key: "address",
          value: state.address
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

  const onClickAddInfo = () => {
    if (state.info.trim().length <= 0) {
      return
    }
    setState({
      ...state,
      info: "",
      infoes: [...state.infoes, state.info]
    })
  }

  const onClickDeleteInfo = (index) => {
    const info = state.infoes[index]
    if (info === undefined) {
      return
    }
    const infoes = [...state.infoes]
    infoes.splice(index, 1)
    setState({
      ...state,
      infoes
    })
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <Row className='fullwidth'>
            <Col lg='6' md='12' className='p-r-0'>
              <CardTitle className='has-action'>
                <span>اطلاعات فروشگاه</span>
                <div className='actions'>
                  <Button color='relief-primary' onClick={onSave}>ثبت</Button>
                </div>
              </CardTitle>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>اطلاعات فروشگاه</Label>
                <div className='flex'>
                  <Input placeholder='مقدار...' value={state.info} onChange={ e => setState({ ...state, info: e.target.value }) } invalid={ errors.info !== undefined } /> &nbsp;
                  <Button color='relief-info' onClick={onClickAddInfo}>
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Table>
                  <thead>
                    <tr>
                      <th>مقدار</th>
                      <th style={{width: "70px"}}>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.infoes.map((info, index) => <tr key={"info_" + index}>
                      <td>{info}</td>
                      <td>
                        <Button color='relief-danger' size='sm' onClick={() => onClickDeleteInfo(index)}>
                          <Trash size={16} />
                        </Button>
                      </td>
                    </tr>)}
                    {(loading === false && state.infoes.length <= 0) && <tr>
                      <td colSpan={2} className="text-center">هنوز اطلاعاتی ثبت نشده است</td>  
                    </tr>}
                    {(loading === true && state.infoes.length <= 0) && <tr>
                      <td colSpan={2} className="text-center">در حال بارگزاری ...</td>  
                    </tr>}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg='6' md='12'>
              <div className='mb-2'>
                <Label>آدرس</Label>
                <Input type='textarea' style={{height: "200px"}} placeholder='آدرس فروشگاه...' value={state.address} onChange={ e => setState({ ...state, address: e.target.value }) } invalid={ errors.address !== undefined } /> &nbsp;
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default ShopInfo