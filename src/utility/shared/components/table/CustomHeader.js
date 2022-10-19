import React, { useEffect, useState } from "react"
import { Badge, Button, Col, Input, Label, Row } from "reactstrap"
import Select from "react-select"
import { Filter, PlusCircle, RefreshCcw } from "react-feather"
import { pageOptions } from "@utils"
import { useDebounce } from "use-debounce"

// you must pass just toggleAdd(will set defaultAddComponent) or custumAddComponent
function CustomHeader({
  onChangeParams,
  onUpdateData,
  toggleAdd,
  customAddComponent,
  toggleFilter,
  onClearFilter,
  isFilterOn,
  breadCrumbsComponent,
  children
}) {
  const [query, setQuery] = useState("")
  const [term] = useDebounce(query, 1000)

  useEffect(() => {
    onChangeParams({ s: term === "" ? null : term })
  }, [term])

  const defaultAddComponent = (
    <Button
      size="sm"
      color="primary"
      onClick={() => {
        toggleAdd(0)
      }}
      className="btn btn-icon me-50"
    >
      <PlusCircle className="font-medium-1" />
    </Button>
  )

  return (
    <div className="w-100 me-1 ms-50 my-2">
      {<Row>{breadCrumbsComponent}</Row>}
      <Row>
        <Col md="4" sm="5" xs="12" className=" my-50">
          <div className="d-flex align-items-center">
            <label htmlFor="rows-per-page">show</label>
            <Select
              className="react-select mx-50 "
              classNamePrefix="select"
              defaultValue={pageOptions[0]}
              options={pageOptions}
              onChange={e => {
                onChangeParams({ limit: e.value, page: 1 })
              }}
            />
            <label htmlFor="rows-per-page">per row</label>
          </div>
        </Col>
        <Col
          md="8"
          sm="7"
          xs="12"
          className="d-flex align-items-center justify-content-start justify-content-sm-end my-50"
        >
          <Label>search</Label>
          <Input
            className="mx-50 w-50"
            onChange={e => {
              setQuery(e.target.value)
            }}
          />
          {toggleFilter && (
            <Button size="sm" color="primary" onClick={toggleFilter} className="btn btn-icon mx-50">
              <Filter className="font-medium-1" />
              {isFilterOn && (
                <div className="position-relative">
                  <Badge
                    onClick={e => {
                      e.stopPropagation()
                      onClearFilter()
                    }}
                    pill
                    color="danger"
                    className="badge-up"
                    style={{ top: "-32px", left: "-15px" }}
                  >
                    x
                  </Badge>
                </div>
              )}
            </Button>
          )}
          <Button
            size="sm"
            color="primary"
            onClick={() => {
              onUpdateData()
            }}
            className="btn btn-icon me-50"
          >
            <RefreshCcw className="font-medium-1" />
          </Button>
          {customAddComponent || (toggleAdd && defaultAddComponent)}
          {children}
        </Col>
      </Row>
    </div>
  )
}

export default CustomHeader
