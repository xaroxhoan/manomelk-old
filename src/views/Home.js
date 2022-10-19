import AdminHome from "@appcomponents/home/admin"
import { getUserData } from '@utils'
import { useEffect, useState } from "react"

const Home = () => {
  const [userData, setUserData] = useState(null)
  
  useEffect(async () => {
    const cache = await window.caches.keys()
    console.log(cache)
    setUserData(getUserData())
  }, [])

  return <>
    {userData !== null ? <>
      {userData.role === "admin" ? <AdminHome /> : undefined}
    </> : undefined}
  </>
}

export default Home
