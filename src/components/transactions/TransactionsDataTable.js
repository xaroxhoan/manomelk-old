import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Input } from 'reactstrap'
import useMoment from '../../hooks/moment'
import useService from '../../hooks/service'
import CustomLoader from '../CustomLoader'
import DataTableSearch from '../DataTableSearch'

const TransactionsDataTable = ({ type }) => {
  const {formatDate} = useMoment()
  const {orders} = useService()
  const [pending, setPending] = useState(true)
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
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
      name: 'Customer',
      selector: row => row.user.name + " " + row.user.family,
      sortable: true
    },
    {
      name: 'Date',
      selector: row => formatDate(row.createdAt),
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
      name: 'Total Price',
      selector: row => `$${row.totalPrice}`,
      sortable: true
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
      </Col>
    </Row>
  )
}

export default TransactionsDataTable