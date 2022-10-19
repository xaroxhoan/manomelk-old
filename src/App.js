import React, { useState, useEffect } from "react"

import { useDispatch } from "react-redux"
import { handleLogin, handleLogout } from "./redux/authentication"

// ** Router Import
import Router from "./router/Router"
import useJwt from "@src/auth/jwt/useJwt"
import { jwtAxios } from "@src/utility/Utils"
import { AbilityContext } from "./utility/context/Can"
import { useAcl } from "./hooks/Acl"
import { useClearCache } from 'react-clear-cache'
import { Button } from "reactstrap"

const App = () => {
  const [loading, setLoading] = useState(true)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const dispatch = useDispatch()
  const { isLatestVersion, emptyCacheStorage } = useClearCache()

  useEffect(async () => {
    const fetchUser = async () => {
      const token = localStorage.getItem(useJwt.jwtConfig.storageTokenKeyName)
      if (token) {
        try {
          const response = await jwtAxios.get(useJwt.jwtConfig.whoEndpoint)
          if (response.data.success && response.data.status === 200) {
            const { _id, name, family, email, role, permissions } = response.data.data
            const userPermissions = permissions === undefined || permissions === null ? [] : permissions
            dispatch(
              handleLogin({
                userData: { userId: _id, name, family, email, role, permissions: userPermissions },
                [useJwt.jwtConfig.storageTokenKeyName]: token.replaceAll('"', "")
              })
            )
          }
        } catch (error) {
          console.log(error)
          dispatch(handleLogout())
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  const onClickUpdate = e => {
    e.preventDefault()
    setLoadingUpdate(true)
    setTimeout(() => {
      emptyCacheStorage()
      setLoadingUpdate(false)
    }, 1000)
  }

  return <>
    {!isLatestVersion ? <div className="version-control-wrapper">
      <div>
        <p>New Version Released!</p>
        <ul>
          <li>Add working hours to ShopInfo settings</li>
        </ul>
        <div>
          <Button color="relief-primary" disabled={loadingUpdate} onClick={onClickUpdate}>
            {loadingUpdate === true ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </div> : undefined}
    <Router loading={loading} />
  </>
}

export default props => {
  const {ability} = useAcl()

  return <AbilityContext.Provider value={ability()}>
    <App {...props} />
  </AbilityContext.Provider>
}
