import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { MoreVertical, Edit, Trash } from 'react-feather'
import { UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Input } from 'reactstrap'
import useMoment from '../../hooks/moment'
import useService from '../../hooks/service'
import CustomLoader from '../CustomLoader'
import DataTableSearch from '../DataTableSearch'

const ContactUsDataTable = () => {
  const {formatDate} = useMoment()
  const {contactus} = useService()
  const [pending, setPending] = useState(true)
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [messageItem, setMessageItem] = useState(null)
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
      const response = await contactus.fetchList({
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

  const onClickDelete = (e, item) => {
    e.preventDefault()
    setSelectedItem(item)
  }

  const onShowMessage = (e, item) => {
    e.preventDefault()
    setMessageItem(item)
  }

  const onDelete = async () => {
    try {
      await contactus.delete(selectedItem._id)
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
      name: 'First Name',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Last Name',
      selector: row => row.family,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true
    },
    {
      name: 'Phone Number',
      selector: row => row.phoneNumber,
      sortable: true
    },
    {
      name: 'subject',
      selector: row => row.subject,
      sortable: true
    },
    {
      name: 'Created At',
      selector: row => formatDate(row.createdAt),
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
            <DropdownItem href='/' onClick={ (e) => onShowMessage(e, row) }>
              <Trash className='me-50' size={15} /> <span className='align-middle'>Show Message</span>
            </DropdownItem>
            <DropdownItem href='/' onClick={ (e) => onClickDelete(e, row) }>
              <Trash className='me-50' size={15} /> <span className='align-middle'>Delete</span>
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
        <Modal isOpen={messageItem !== null} toggle={() => setMessageItem(null)} className='modal-dialog-centered'>
          <ModalHeader toggle={() => setMessageItem(null)}>Message</ModalHeader>
          <ModalBody>{messageItem !== null ? messageItem.message : ''}</ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => setMessageItem(null)}>Close</Button>
          </ModalFooter>
        </Modal>
      </Col>
    </Row>
  )
}

export default ContactUsDataTable