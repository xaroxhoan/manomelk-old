// ** React Imports
import React, { Fragment } from "react"

// ** Reactstrap Imports
import { Button } from "reactstrap"

// ** Third Party Components
import { Trash } from "react-feather"

// ** Custom Components
import { columns } from "./columns"
import Breadcrumbs from "@components/breadcrumbs"

import CustomTable from "../../utility/shared/components/table/CustomTable"
import CustomHeader from "../../utility/shared/components/table/CustomHeader"

function HealthCounterTable(props) {
  const { sessions, pageOptions, loading, onChangeParams, toggleDelete, reloadData } = props

  const updatedColumns = [
    ...columns,
    {
      name: "action",
      minWidth: "100px",
      cell: row => (
        <div className="d-flex align-items-center justify-content-center w-100">
          <Button
            size="sm"
            color="danger"
            tag="a"
            onClick={() => {
              toggleDelete(row._id)
            }}
            className="btn btn-icon"
          >
            <Trash className="font-medium-1" />
          </Button>
        </div>
      ),
      center: true
    }
  ]

  const breadCrumbsComponent = (
    <Breadcrumbs breadCrumbTitle="sessions" breadCrumbParent="sessions" breadCrumbActive="all" />
  )

  return (
    <Fragment>
      <CustomTable
        data={sessions}
        columns={updatedColumns}
        pageOptions={pageOptions}
        onChangeParams={onChangeParams}
        loading={loading}
        subHeaderComponent={
          <CustomHeader
            onChangeParams={onChangeParams}
            onUpdateData={reloadData}
            breadCrumbsComponent={breadCrumbsComponent}
          />
        }
      />
    </Fragment>
  )
}

export default HealthCounterTable
