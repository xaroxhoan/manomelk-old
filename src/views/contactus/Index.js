import { Card, CardHeader, CardBody, CardTitle } from 'reactstrap'
import ContactUsDataTable from '@appcomponents/contactus/ContactUsDataTable'

const ContactUsIndex = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-action'>
            <span>ارتباط با ما</span>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <ContactUsDataTable />
        </CardBody>
      </Card>
    </div>
  )
}

export default ContactUsIndex
