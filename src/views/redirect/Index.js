import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { toast, Slide } from "react-toastify"
import { handleLogin } from "@src/redux/authentication"
import useJwt from "@src/auth/jwt/useJwt"
import useService from "../../hooks/service"

const RedirectIndex = ({ match }) => {
    const {seller} = useService()
    const dispatch = useDispatch()
    const history = useHistory()
    const [state, setState] = useState({
        status: ""
    })

    useEffect(async () => {
        try {
            const response = await seller.validateToken(match.params.token)
            const { _id, name, family, email, type, token, permissions } = response.data.data || {}
            const userPermissions = permissions === undefined || permissions === null ? [] : permissions
            dispatch(
                handleLogin({
                    userData: { userId: _id, name, family, email, role: type, permissions: userPermissions },
                    [useJwt.jwtConfig.storageTokenKeyName]:
                    token
                })
            )
            history.push("/home")
            toast.success(<ToastContent name={name + " " + family} />, {
                icon: false,
                transition: Slide,
                hideProgressBar: true,
                autoClose: 2000
            })
        } catch (e) {
            setState({
                status: "404 Not Found"
            })
        }
    }, [])

    return <>
        <div></div>
    </>
}

export default RedirectIndex