import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Input } from 'reactstrap'
import useMoment from '../../hooks/moment'
import useService from '../../hooks/service'
import CustomLoader from '../CustomLoader'
import DataTableSearch from '../DataTableSearch'
import NoDataComponent from '../NoDataComponent'

const TransactionsDataTable = ({ type }) => {
  const {formatDate} = useMoment()
  const {transactions} = useService()
  const [pending, setPending] = useState(true)
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    totalRows: 0,
    perPage: 8
  })

  const fetchData = async (page) => {
    try {
     setPending(true)
      const response = await transactions.fetchList({
        status: type,
        page,
        perPage: pagination.perPage,
        searchText
      })
      const result = response.data.result
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
      await transactions.delete(selectedItem._id)
      setSelectedItem(null)
      await fetchData(pagination.page)
    } catch (e) {}
  }

  const onSearch = value => {
    setSearchText(value)
  }

  const columns = [
    {
      name: 'کاربر',
      selector: row => row.user.name + " " + row.user.family,
      sortable: true
    },
    {
      name: 'نوع تراکنش',
      selector: row => {
        let result = "-"
        if (row.tarrif !== null) {
          result = `خرید تعرفه ${row.tarrif.title}`
        }
        return result
      },
      sortable: true
    },
    {
      name: 'تاریخ',
      selector: row => formatDate(row.createdAt),
      sortable: true
    },
    {
      name: 'وضعیت تراکنش',
      selector: row => {
        let status = "-"
        switch (row.status) {
          case "pending":
            status = "در حال تایید"
            break
          case "success":
            status = "تایید شده"
            break
          case "fail":
            status = "ناموفق"
            break
        }
        return <span className={`text-status text-status-${row.status}`}>{status}</span>
      },
      sortable: true
    },
    {
      name: 'مبلغ پرداختی (تومان)',
      selector: row => `${row.price} تومان`,
      sortable: true
    }
  ]

  return (
    <Row>
      <DataTableSearch 
        defaultSearchText={searchText}
        onSearch={onSearch} 
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
          noDataComponent={<NoDataComponent columns={columns} />}
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