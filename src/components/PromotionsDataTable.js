import { useEffect, useMemo, useState } from "react"
import DataTable from "react-data-table-component"
import { Col, Input, Row } from "reactstrap"

const PromotionsDataTable = ({ type }) => {

    const [pending, setPending] = useState(true)
    const [data, setData] = useState([])
    
    const columns = [
        {
            name: 'Promotion',
            selector: row => <span className="font-bold text-capitalize">{ row.name }</span>,
            sortable: true
        },
        {
            name: 'Discount',
            selector: row => row.discount,
            sortable: true
        },
        {
            name: 'Used',
            selector: row => row.used,
            sortable: true
        },
        {
            name: 'Starts',
            selector: row => row.starts,
            sortable: true
        },
        {
            name: 'Ends',
            selector: row => row.expires,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => <span className={`text-status text-status-${row.status}`}>{ row.status }</span>,
            sortable: true
        }
    ]

    useEffect(() => {
        setData([
            {
                id: 1,
                name: 'Mother\'s day',
                discount: '$11.00 of shipping',
                used: 1,
                starts: 'Apr 14, 2021',
                expires: 'Apr 15, 2021',
                status: (type === 'promotions' ? 'active' : type)
            },
            {
                id: 2,
                name: 'Mother\'s day',
                discount: '$11.00 of shipping',
                used: 1,
                starts: 'Apr 14, 2021',
                expires: 'Apr 15, 2021',
                status: (type === 'promotions' ? 'active' : type)
            },
            {
                id: 3,
                name: 'Mother\'s day',
                discount: '$11.00 of shipping',
                used: 1,
                starts: 'Apr 14, 2021',
                expires: 'Apr 15, 2021',
                status: (type === 'promotions' ? 'active' : type)
            },
            {
                id: 4,
                name: 'Mother\'s day',
                discount: '$11.00 of shipping',
                used: 1,
                starts: 'Apr 14, 2021',
                expires: 'Apr 15, 2021',
                status: (type === 'promotions' ? 'active' : type)
            },
            {
                id: 5,
                name: 'Mother\'s day',
                discount: '$11.00 of shipping',
                used: 1,
                starts: 'Apr 14, 2021',
                expires: 'Apr 15, 2021',
                status: (type === 'promotions' ? 'active' : type)
            },
            {
                id: 6,
                name: 'Mother\'s day',
                discount: '$11.00 of shipping',
                used: 1,
                starts: 'Apr 14, 2021',
                expires: 'Apr 15, 2021',
                status: (type === 'promotions' ? 'active' : type)
            },
            {
                id: 7,
                name: 'Mother\'s day',
                discount: '$11.00 of shipping',
                used: 1,
                starts: 'Apr 14, 2021',
                expires: 'Apr 15, 2021',
                status: (type === 'promotions' ? 'active' : type)
            },
            {
                id: 8,
                name: 'Mother\'s day',
                discount: '$11.00 of shipping',
                used: 1,
                starts: 'Apr 14, 2021',
                expires: 'Apr 15, 2021',
                status: (type === 'promotions' ? 'active' : type)
            },
            {
                id: 9,
                name: 'Mother\'s day',
                discount: '$11.00 of shipping',
                used: 1,
                starts: 'Apr 14, 2021',
                expires: 'Apr 15, 2021',
                status: (type === 'promotions' ? 'active' : type)
            },
            {
                id: 10,
                name: 'Mother\'s day',
                discount: '$11.00 of shipping',
                used: 1,
                starts: 'Apr 14, 2021',
                expires: 'Apr 15, 2021',
                status: (type === 'promotions' ? 'active' : type)
            }
        ])
        setPending(false)
    }, [])
    return (
        <Row>
            <Col lg={12}>
                <Input placeholder='Search . . .' invalid={ false } />
            </Col>
            <Col lg={12} className="sc-datatable-wrapper">
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    pointerOnHover
                />
            </Col>
        </Row>
    )
}

export default PromotionsDataTable