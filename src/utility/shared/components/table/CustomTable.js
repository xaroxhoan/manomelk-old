import React from "react"
import DataTable from "react-data-table-component"
import { ChevronDown } from "react-feather"
import { customLoader } from "@utils"
import { useSelector } from "react-redux"

import { Card, CardFooter } from "reactstrap"
import ReactPaginate from "react-paginate"

function CustomTable({ data, columns, pageOptions, onChangeParams, loading, subHeaderComponent, ...props }) {
  const theme = useSelector(state => state.layout.skin)

  const CustomPagination = () => {
    const Previous = () => {
      return <span className="align-middle d-none d-md-inline-block">Previous</span>
    }
    const Next = () => {
      return <span className="align-middle d-none d-md-inline-block">Next</span>
    }
    return (
      <CardFooter>
        <ReactPaginate
          pageCount={pageOptions.totalPages || 1}
          forcePage={pageOptions.currentPage !== 0 ? pageOptions.currentPage - 1 : 0}
          onPageChange={page => onChangeParams({ page: page.selected + 1 })}
          breakLabel="..."
          nextLabel={<Next />}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          activeClassName="active"
          pageClassName="page-item"
          breakClassName="page-item"
          previousLabel={<Previous />}
          nextLinkClassName="page-link"
          pageLinkClassName="page-link"
          nextClassName="page-item next"
          breakLinkClassName="page-link"
          previousClassName="page-item prev"
          previousLinkClassName="page-link"
          containerClassName="pagination react-paginate  pagination-sm justify-content-center mb-0"
        />
      </CardFooter>
    )
  }

  const handleSort = (column, order) => {
    onChangeParams({ sort: column.sortField, order })
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader={true}
            data={data}
            columns={columns}
            className="react-dataTable"
            pagination
            paginationDefaultPage={pageOptions.currentPage}
            paginationServer
            responsive={true}
            sortIcon={<ChevronDown size={10} />}
            sortServer
            defaultSortField=""
            onSort={handleSort}
            progressComponent={customLoader()}
            noDataComponent="not found"
            progressPending={loading}
            paginationComponent={CustomPagination}
            subHeaderComponent={subHeaderComponent}
            theme={theme}
            {...props}
          />
        </div>
      </Card>
    </>
  )
}

export default CustomTable
