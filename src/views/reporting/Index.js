import { useState } from 'react'
import { Card, CardHeader, CardBody, CardTitle } from 'reactstrap'
import ReportingItems from '../../components/ReportingItems'

const ReportingIndex = () => {

  const [salesReports, setSalesReports] = useState([
    { title: 'Sales by day' },
    { title: 'Sales by month' },
    { title: 'Sales by product' },
    { title: 'Sales by SKU' },
    { title: 'Sales by coupon' },
    { title: 'Sales by promotion' },
    { title: 'Sales by shipping country' },
    { title: 'Sales by customer' }
  ])

  const [customersReports, setCustomersReports] = useState([
    { title: 'Customers over time' },
    { title: 'First-time vs returning customers' },
    { title: 'Customers by country' },
    { title: 'Returning customers' },
    { title: 'First-time customers' }
  ])

  const [financialReports, setFinancialReports] = useState([
    { title: 'Payments by type' },
    { title: 'Taxes by country' },
    { title: 'Taxes by state' },
    { title: 'Taxes by rate' }
  ])

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='has-sub'>
            <strong>Sales Report</strong>
            <small>View detailed reports on your sales</small>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <ReportingItems items={salesReports} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='has-sub'>
            <strong>Customers Report</strong>
            <small>View detailed reports on your customers</small>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <ReportingItems items={customersReports} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='has-sub'>
            <strong>Financial Report</strong>
            <small>View detailed reports on your finances</small>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <ReportingItems items={financialReports} />
        </CardBody>
      </Card>
    </div>
  )
}

export default ReportingIndex
