import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Edit, List, MoreVertical } from 'react-feather'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Input, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu, Table } from 'reactstrap'
import useMoment from '../../hooks/moment'
import useService from '../../hooks/service'
import { jwtAxios } from '../../utility/Utils'
import CustomLoader from '../CustomLoader'
import DataTableSearch from '../DataTableSearch'

const OrdersDataTable = ({ type }) => {
  const {formatDate} = useMoment()
  const {orders} = useService()
  const [pending, setPending] = useState(true)
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    totalRows: 0,
    perPage: 8
  })
  const [filters, _] = useState([
    { title: 'title', operators: ['equals', 'not equal', 'contains'] },
    { title: 'alias', operators: ['equals', 'not equal', 'contains'] }
  ])
  const [advancedSearch, setAdvancedSearch] = useState([])

  const fetchData = async (page) => {
    try {
     setPending(true)
      const response = await orders.fetchList({
        status: type,
        page,
        perPage: pagination.perPage,
        searchText
      })
      const result = response.data.data
      setItems(result.items)
      setPagination({ 
        ...pagination,
        page: result.page,
        totalRows: result.totalRows,
        perPage: result.perPage
      })
     setPending(false)
    } catch (e) {}
  }

  useEffect(async () => {
    await fetchData(1)
  }, [searchText])

  const onChangePage = async page => {
    await fetchData(page)
  }

  const onDelete = async () => {
    try {
      await orders.delete(selectedItem._id)
      setSelectedItem(null)
      await fetchData(pagination.page)
    } catch (e) {}
  }

  const onSearch = value => {
    setSearchText(value)
  }

  const onAdvancedSearch = values => {
    setAdvancedSearch(values)
  }

  const columns = [
    {
      name: 'Order',
      selector: row => <a href={'#'} onClick={ (e) => {
        e.preventDefault()
        setSelectedOrder(row)
      } }>{row.orderCode}</a>,
      sortable: true
    },
    {
      name: 'Date',
      selector: row => formatDate(row.createdAt),
      sortable: true
    },
    {
      name: 'Customer',
      selector: row => (row.user !== undefined && row.user !== null ? (row.user.name !== undefined && row.user.name !== null ? row.user.name + " " + row.user.family : "-") : "-"),
      sortable: true
    },
    {
      name: 'Payment',
      selector: row => (
          <span className="flex flex-has-icon">
              <svg viewBox="0 0 48 48" width="35px" height="35px"><path fill="#2100c4" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4 V35z"/><path fill="#fff" d="M15.186,19l-2.626,7.832c0,0-0.667-3.313-0.733-3.729c-1.495-3.411-3.701-3.221-3.701-3.221 L10.726,30v-0.002h3.161L18.258,19H15.186z M17.689,30h2.871l1.736-11h-2.907L17.689,30z M38.008,19h-3.021l-4.71,11h2.852 l0.588-1.571h3.596L37.619,30h2.613L38.008,19z M34.513,26.328l1.563-4.157l0.818,4.157H34.513z M26.369,22.206 c0-0.606,0.498-1.057,1.926-1.057c0.928,0,1.991,0.674,1.991,0.674l0.466-2.309c0,0-1.358-0.515-2.691-0.515 c-3.019,0-4.576,1.444-4.576,3.272c0,3.306,3.979,2.853,3.979,4.551c0,0.291-0.231,0.964-1.888,0.964 c-1.662,0-2.759-0.609-2.759-0.609l-0.495,2.216c0,0,1.063,0.606,3.117,0.606c2.059,0,4.915-1.54,4.915-3.752 C30.354,23.586,26.369,23.394,26.369,22.206z"/><path fill="#f5bc00" d="M12.212,24.945l-0.966-4.748c0,0-0.437-1.029-1.573-1.029s-4.44,0-4.44,0 S10.894,20.84,12.212,24.945z"/></svg>
              <span>{ row.paymentType }</span>
          </span>
      ),
      sortable: true
    },
    {
      name: 'Status',
      selector: row => <span className={`text-status text-status-${row.status}`}>{ row.status }</span>,
      sortable: true
    },
    {
      name: 'Original Price',
      selector: row => `$${row.originalPrice}`,
      sortable: true
    },
    {
      name: 'Coupon',
      selector: row => {
        if (row.cartCoupon === null) {
          return 'ــــ'
        }
        return <div>
          <div><strong>Code:</strong> <span>{row.cartCoupon.coupon.code}</span></div>
          <div><strong>Amount:</strong> <span>{row.cartCoupon.coupon.amountType === 'percentage' ? '%' : '$'} {row.cartCoupon.coupon.amount}</span></div>
        </div>
      },
      sortable: true
    },
    {
      name: 'Shipping Price',
      selector: row => {
        return `$${row.shippingPrice}`
      },
      sortable: true
    },
    {
      name: 'GST Price',
      selector: row => {
        return `$${row.gstPrice}`
      },
      sortable: true
    },
    {
      name: 'Total Price',
      selector: row => {
        return `$${row.totalPrice}`
      },
      sortable: true
    },
    {
      name: '',
      width: '80px',
      selector: row => <UncontrolledDropdown>
        <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
            <MoreVertical size={15} />
        </DropdownToggle>
        <DropdownMenu>
            <DropdownItem href={'#'} onClick={ (e) => {
              e.preventDefault()
              setSelectedOrder(row)
            } }>
              <List className='me-50' size={15} /> <span className='align-middle'>Show Order Items</span>
            </DropdownItem>
            <DropdownItem href={ `/orders/edit/${ row._id }` } onClick={ e => onClickEdit(e, `/products/orders/${ row._id }`) }>
              <Edit className='me-50' size={15} /> <span className='align-middle'>Edit</span>
            </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    }
  ]

  return (
    <Row>
      <DataTableSearch 
        defaultSearchText={searchText}
        filters={filters}
        defaultFilters={advancedSearch}
        onSearch={onSearch} 
        onAdvancedSearch={onAdvancedSearch}
      />
      <Col lg={12} className="sc-datatable-wrapper">
        <DataTable
          columns={columns}
          data={items}
          pagination
          paginationServer
          paginationDefaultPage={pagination.page}
          paginationTotalRows={pagination.totalRows}
          paginationPerPage={pagination.perPage}
          paginationComponentOptions={{ noRowsPerPage: true }}
          onChangePage={onChangePage}
          selectableRows
          progressPending={pending}
          progressComponent={<CustomLoader columns={columns} />}
        />
        <Modal isOpen={selectedItem !== null} toggle={() => setSelectedItem(null)} className='modal-dialog-centered'>
          <ModalHeader toggle={() => setSelectedItem(null)}>Delete</ModalHeader>
          <ModalBody>Are You Sure?</ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => setSelectedItem(null)}>No</Button>
            <Button color='danger' onClick={onDelete}>Yes</Button>
          </ModalFooter>
        </Modal>
        {selectedOrder !== null && <Modal isOpen={true} toggle={() => setSelectedOrder(null)} className='modal-dialog-centered modal-xl modal-order-items'>
            <ModalHeader toggle={() => setSelectedOrder(null)}>Details</ModalHeader>
            <ModalBody>
              <strong>Order Items:</strong>
              <DataTable
                columns={[
                  {
                    name: 'Image',
                    selector: row => <div className='image-wrapper'><img src={ row.product.imageGallery[0].isExternalUrl ? row.product.imageGallery[0].file : `${jwtAxios.defaults.baseURL}${row.product.imageGallery[0].destination}${row.product.imageGallery[0].file}` } alt="" /></div>,
                    sortable: false
                  },
                  {
                    name: 'SKU',
                    selector: row => row.product.sku,
                    sortable: true
                  },
                  {
                    name: 'Title',
                    selector: row => row.product.title,
                    sortable: true
                  },
                  {
                    name: 'Seller',
                    selector: row => <div><div>{row.product.seller.email}</div><div>{row.product.seller.mobile}</div></div>,
                    sortable: true
                  },
                  {
                    name: 'Count',
                    selector: row => row.count,
                    sortable: true
                  }
                ]}
                data={selectedOrder.orderItems}
                pagination
              />
              <div>
                <div><strong>Shipping Address:</strong></div><br />
                <Table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Full Name</th>
                      <th>Mobile</th>
                      <th>Country</th>
                      <th>Zip Code</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{selectedOrder.shippingAddress.title}</td>
                      <td>{selectedOrder.shippingAddress.fullName}</td>
                      <td>{selectedOrder.shippingAddress.mobile}</td>
                      <td>{selectedOrder.shippingAddress.country.name.common}</td>
                      <td>{selectedOrder.shippingAddress.zipCode}</td>
                      <td>{selectedOrder.shippingAddress.address}</td>
                    </tr>
                  </tbody>
                </Table>
              </div><br />
              <div>
                <div><strong>Billing Address:</strong></div><br />
                <Table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Full Name</th>
                      <th>Mobile</th>
                      <th>Country</th>
                      <th>Zip Code</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{selectedOrder.billingAddress.title}</td>
                      <td>{selectedOrder.billingAddress.fullName}</td>
                      <td>{selectedOrder.billingAddress.mobile}</td>
                      <td>{selectedOrder.billingAddress.country.name.common}</td>
                      <td>{selectedOrder.billingAddress.zipCode}</td>
                      <td>{selectedOrder.billingAddress.address}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
                <Button color='primary' outline onClick={() => window.print()}>Print</Button>
                <Button color='primary' onClick={() => setSelectedOrder(null)}>Ok</Button>
            </ModalFooter>
        </Modal>}
      </Col>
    </Row>
  )
}

export default OrdersDataTable