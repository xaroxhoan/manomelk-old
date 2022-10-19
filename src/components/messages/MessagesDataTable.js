import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { MoreVertical, Edit, Trash } from 'react-feather'
import { UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Input } from 'reactstrap'
import useService from '../../hooks/service'
import CustomLoader from '../CustomLoader'
import DataTableSearch from '../DataTableSearch'

const MessagesDataTable = ({ onClickMessagesList, type, onChangePublishSwitch }) => {
  const {messages} = useService()
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
      const response = await messages.fetchList({
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

  const onClickDelete = (e, item) => {
    e.preventDefault()
    setSelectedItem(item)
  }

  const onDelete = async () => {
    try {
      await messages.delete(selectedItem._id)
      setSelectedItem(null)
      await fetchData(pagination.page)
    } catch (e) {}
  }

  const onClickMessages = (e, row) => {
    e.preventDefault()
    onClickMessagesList(row)
  }

  const onSearch = value => {
    setSearchText(value)
  }

  const onAdvancedSearch = values => {
    setAdvancedSearch(values)
  }

  const onChangeSwitch = row => {
    onChangePublishSwitch(row, pagination, fetchData)
  }

  const columns = [
    {
      name: 'Sender',
      selector: row => <>
        <div>{`${row.sender.name + " " + row.sender.family} (${row.sender.type})`}</div>
        <div><strong>{row.sender.email}</strong></div>
      </>,
      sortable: true
    },
    {
      name: 'Receiver',
      selector: row => <>
        <div>{`${row.receiver.name + " " + row.receiver.family} (${row.receiver.type})`}</div>
        <div><strong>{row.receiver.email}</strong></div>
      </>,
      sortable: true
    },
    {
      name: 'Status',
      width: '120px',
      selector: row => <div className='d-flex flex-column'>
        <div className='form-switch form-check-primary'>
          <Input type='switch' name='primary' onChange={() => onChangeSwitch(row)} defaultChecked={row.status === 'open'} value={type === 'open' ? 'close' : 'open'} />
        </div>
      </div>
    },
    {
      name: '',
      width: '80px',
      selector: row => <UncontrolledDropdown>
        <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
            <MoreVertical size={15} />
        </DropdownToggle>
        <DropdownMenu>
            <DropdownItem href={'#'} onClick={ e => onClickMessages(e, row) }>
              <Edit className='me-50' size={15} /> <span className='align-middle'>Messages</span>
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
      </Col>
    </Row>
  )
}

export default MessagesDataTable