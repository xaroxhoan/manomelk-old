import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { MoreVertical, Edit, Trash } from 'react-feather'
import { UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Label, Input } from 'reactstrap'
import useService from '../../hooks/service'
import CustomLoader from '../CustomLoader'
import DataTableSearch from '../DataTableSearch'

const CommentsDataTable = ({ onClickUpdate, type, onChangePublishSwitch }) => {
  const {blog} = useService()
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
    { title: 'email', operators: ['equals', 'not equal', 'contains'] },
    { title: 'subject', operators: ['equals', 'not equal', 'contains'] }
  ])
  const [advancedSearch, setAdvancedSearch] = useState([])

  const fetchData = async (page) => {
    try {
     setPending(true)
      const response = await blog.reviews.fetchList({
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
      await blog.reviews.delete(selectedItem._id)
      setSelectedItem(null)
      await fetchData(pagination.page)
    } catch (e) {}
  }

  const onClickEdit = (e, row) => {
    e.preventDefault()
    onClickUpdate(row)
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
      name: 'Article',
      selector: row => (row.article.title.substring(0, (row.article.title.length < 20 ? row.article.title.length : 20)) + (row.article.title.length < 20 ? "" : "...")),
      sortable: true
    },
    {
      name: 'Full Name',
      selector: row => row.fullName,
      sortable: true
    },
    {
      name: 'Publish',
      width: '120px',
      selector: row => <div className='d-flex flex-column'>
        <div className='form-switch form-check-primary'>
          <Input type='switch' name='primary' onChange={() => onChangeSwitch(row)} defaultChecked={row.status === 'approved'} value={type === 'approved' ? 'pending' : 'approved'} />
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
            <DropdownItem href={'#'} onClick={ e => onClickEdit(e, row) }>
              <Edit className='me-50' size={15} /> <span className='align-middle'>Edit</span>
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

export default CommentsDataTable