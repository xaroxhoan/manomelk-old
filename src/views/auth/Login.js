import React, { Fragment, useEffect, useState } from "react"
import { useSkin } from "@hooks/useSkin"
import { Link, useHistory } from "react-router-dom"
import { Coffee } from "react-feather"
import InputPasswordToggle from "@components/input-password-toggle"
import { Row, Col, CardTitle, CardText, Form, Label, Input, Button } from "reactstrap"
import "@styles/react/pages/page-authentication.scss"

import Avatar from "@components/avatar"
import { useForm, Controller } from "react-hook-form"
import useJwt from "@src/auth/jwt/useJwt"
import { useDispatch } from "react-redux"
import { handleLogin } from "@src/redux/authentication"
import { toast, Slide } from "react-toastify"
import { useRTL } from "@hooks/useRTL"
import ApiErrorHandler from "@src/utility/shared/ApiErrorHandler"
import LoadingButton from "@src/utility/shared/components/LoadingButton"
import qs from "qs"

const defaultValues = {
  email: "",
  password: ""
}

const ToastContent = ({ name }) => (
  <Fragment>
    <div className="toastify-header">
      <div className="title-wrapper">
        <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
        <h6 className="toast-title fw-bold">{name} عزیز خوش آمدید!</h6>
      </div>
    </div>
    <div className="toastify-body">
      <span>خوش آمدید</span>
    </div>
  </Fragment>
)

const LoginCover = () => {
  const [sending, setSending] = useState(false)
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const [isRtl, setIsRtl] = useRTL()
  const history = useHistory()
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({ defaultValues })

  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = async formData => {
    formData["g-recaptcha-response"] = "test"
    setSending(true)
    try {
      const response = await useJwt.login(qs.stringify(formData))
      if (response.data.statusCode !== 200) {
        setSending(false)
        ApiErrorHandler(response.data, response.data.statusCode)
        return
      }
      const {_id, name, family, email, role, permissions} = response.data.result.user
      const token = response.data.result.token
      const userPermissions = permissions === undefined || permissions === null ? [] : permissions
      dispatch(
        handleLogin({
          userData: { userId: _id, name, family, email, role, permissions: userPermissions },
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
    } catch (error) {
      ApiErrorHandler(error)
    }
    setSending(false)
  }

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={e => e.preventDefault()}>
          <h2 className="brand-text text-primary ms-1">login</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="4" sm="12">
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
            welcome back
            </CardTitle>
            <CardText className="mb-2">please login.</CardText>
            <Form className="auth-login-form mt-2" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-1">
                <Label className="form-label" for="login-email">
                  email
                </Label>
                <Controller
                  id="loginEmail"
                  name="email"
                  control={control}
                  defaultValue="dd"
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type="email"
                      placeholder="john@example.com"
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="mb-1">
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    password
                  </Label>
                </div>
                <Controller
                  name="password"
                  id="password"
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className="input-group-merge"
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
              </div>

              <LoadingButton type="submit" color="success" className="mx-1" loading={sending}>
                login
              </LoadingButton>
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default LoginCover
