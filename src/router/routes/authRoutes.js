import { lazy } from "react"

export default [
  {
    path: "/login",
    component: lazy(() => import("../../views/auth/Login")),
    layout: "BlankLayout",
    meta: {
      authRoute: true
    }
  },
  {
    path: "/redirect/:token",
    component: lazy(() => import("../../views/redirect/Index")),
    layout: "BlankLayout",
    meta: {
      authRoute: true
    }
  }
]
