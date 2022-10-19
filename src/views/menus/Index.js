import { useHistory } from 'react-router-dom'
import { Card, CardHeader, CardBody, CardTitle, Button } from 'reactstrap'
import MenusDataTable from '@appcomponents/menus/MenusDataTable'

const OrdersIndex = () => {
  const history = useHistory()

  const onClickNewMenu = () => {
    history.push('/menus/create')
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>Menus</span>
            <div className='actions'>
              <Button block color='relief-primary' onClick={ onClickNewMenu }>New menu</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <MenusDataTable />
        </CardBody>
      </Card>
    </div>
  )
}

export default OrdersIndex
