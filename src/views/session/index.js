// ** React imports
import React, { useState, useEffect } from "react"

// ** Third Party Componenets
import qs from "qs"
import _ from "lodash"

// ** Custom Components
import { useFetch } from "@src/utility/hooks/useFetch"
import SessionTable from "./SessionTable"
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, ApiPageOptionsCreator, DeleteConfirmation } from "@utils"
import ApiErrorHandler from "@src/utility/shared/ApiErrorHandler"
import CustomModal from "../../utility/shared/components/CustomModal"

const paramsSerializer = params => {
  return qs.stringify(_.omitBy(params, _.isNil))
}

function Session({ isOpen, onToggle }) {
  // -------------------------
  const initialFetchParams = {
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    s: null,
    sort: null,
    order: null
  }
  // -------------------------
  const [params, setParams] = useState(initialFetchParams)
  const { data, loading, error, reloadData, onDelete } = useFetch({
    config: {
      url: "/share/session",
      params,
      paramsSerializer
    }
  })
  console.log(params)
  // -------------------------
  useEffect(() => {
    if (error?.response) ApiErrorHandler(error?.response?.data, error?.response?.status)
  }, [error])
  // -------------------------
  const handleChangeParams = paramsObject => {
    console.log(paramsObject)
    setParams(prev => ({ ...prev, ...paramsObject }))
  }
  // -------------------------
  const handleDelete = id => {
    DeleteConfirmation(() => onDelete(`/share/session/logout?id=${id}`), reloadData)
  }
  // -------------------------
  return (
    <CustomModal isOpen={isOpen} onToggle={onToggle} title="profile" size="xl">
      <SessionTable
        sessions={data.data?.items || []}
        pageOptions={ApiPageOptionsCreator(data)}
        loading={loading}
        onChangeParams={handleChangeParams}
        toggleDelete={handleDelete}
        reloadData={reloadData}
      />
    </CustomModal>
  )
}

export default Session
