// ** React Imports
import React, { useState, useEffect } from "react"

// ** Custom Components
import Avatar from "@components/avatar"
import { handleLogout } from "@src/redux/authentication"
import Session from "@src/views/session"
import useToggle from "@src/utility/hooks/useToggle"

// ** Utils
import { isUserLoggedIn } from "@src/auth/utils.js"

// ** Third Party Components
import { Power, HelpCircle } from "react-feather"
import { Link, useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"

// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from "reactstrap"

// ** Default Avatar Image

const UserDropdown = () => {
  // ** State
  const [sessionModal, toggleSessionModal] = useToggle()
  const [userData, setUserData] = useState(null)
  const dispatch = useDispatch()
  const history = useHistory()

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")))
    }
  }, [])

  //** Vars

  return (
    <>
      <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
        <DropdownToggle
          href="/"
          tag="a"
          className="nav-link dropdown-user-link"
          onClick={e => e.preventDefault()}
        >
          <div className="user-nav d-sm-flex d-none">
            <span className="user-name fw-bold">{(userData ? userData["name"] + " " + userData["family"] : "")}</span>
            <span className="user-status">{(userData && userData.role) || "Admin"}</span>
          </div>
          <Avatar  imgHeight="40" imgWidth="40" status="online" />
        </DropdownToggle>
        <DropdownMenu end>
          <DropdownItem tag="a" onClick={toggleSessionModal}>
            <HelpCircle size={14} className="me-75" />
            <span className="align-middle">sessions</span>
          </DropdownItem>
          <DropdownItem
            tag={Link}
            to="/"
            onClick={e => {
              e.preventDefault()
              dispatch(handleLogout())
              history.push("/")
            }}
          >
            <Power size={14} className="me-75" />
            <span className="align-middle">logout</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>

      {sessionModal && <Session isOpen={sessionModal} onToggle={toggleSessionModal} />}
    </>
  )
}

export default UserDropdown
