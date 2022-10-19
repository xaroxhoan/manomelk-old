import React, { useState } from "react"
import { jwtAxios } from "../Utils"
import useDeepCompareEffect from "./useDeepCompareEffect"

export const useFetch = ({ config, HttpHandler = jwtAxios, condition = true }) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data } = await HttpHandler(config)
      setData(data)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  useDeepCompareEffect(fetchData, config.params, condition)

  const reloadData = () => fetchData()

  const onDelete = async url => {
    try {
      const { data } = await HttpHandler.delete(url)
      return Promise.resolve(data)
    } catch (error) {
      console.log(error)
      setError(error)
      return Promise.reject()
    }
  }

  return { data, loading, error, reloadData, onDelete }
}
