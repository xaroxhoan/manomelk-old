// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Dropdowns Imports
import UserDropdown from './UserDropdown'

// ** Third Party Components
import { Sun, Moon } from 'react-feather'

// ** Reactstrap Imports
import { NavItem, NavLink } from 'reactstrap'

import { getUserData } from '@utils'
import useService from '../../../../hooks/service'

const NavbarUser = props => {
  // ** Props
  const { skin, setSkin } = props
  const {wallet} = useService()

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
    }
  }

  const [userData, setUsetData] = useState(null)
  const [walletData, setWalletData] = useState(null)

  useEffect(async () => {
    try {
      const response = await wallet.byUser()
      setWalletData(response.data.data)
    } catch (e) {}
    setUsetData(getUserData())
  }, [])

  return (
    <Fragment>
      {userData !== null && userData.role === "seller" ? <div className='d-flex align-items-center'>
        <div className='wallet-wrapper'>
          <div>Blocked Wallet Amount: {walletData !== null ? walletData.blockedWallet : "0"}$</div>
          <div>Cashable Wallet Amount: {walletData !== null ? walletData.wallet : "0"}$</div>
        </div>
      </div> : undefined}
      <div className='bookmark-wrapper d-flex align-items-center'>
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <ThemeToggler />
          </NavLink>
        </NavItem>
      </div>
      <ul className='nav navbar-nav align-items-center ms-auto'>
        <UserDropdown />
      </ul>
    </Fragment>
  )
}
export default NavbarUser
