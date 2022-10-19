// ** React Imports
import { Suspense, lazy } from "react"
import ReactDOM from "react-dom"

// ** Redux Imports
import { Provider } from "react-redux"
import { store } from "./redux/store"

// ** Intl & ThemeColors Context
import { ToastContainer } from "react-toastify"
import { ThemeContext } from "./utility/context/ThemeColors"

// ** Spinner (Splash Screen)
import Spinner from "./@core/components/spinner/Fallback-spinner"

// ** Ripple Button
import "./@core/components/ripple-button"

// ** PrismJS
import "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-jsx.min"

// ** React Perfect Scrollbar
import "react-perfect-scrollbar/dist/css/styles.css"

// ** React Toastify
import "@styles/react/libs/toastify/toastify.scss"

// ** React Select
import "@styles/react/libs/react-select/_react-select.scss"

// ** Swipper
import "@styles/react/libs/swiper/swiper.scss"

// ** DataTable
import "@styles/react/libs/tables/react-dataTable-component.scss"

// ** Core styles
import "./@core/assets/fonts/feather/iconfont.css"
import "./@core/scss/core.scss"
import "./assets/scss/style.scss"

// ** Custom Styles
import "@src/assets/scss/app.scss"

// ** Service Worker
import * as serviceWorker from "./serviceWorker"

window.process = {}

// ** Lazy load app
const LazyApp = lazy(() => import("./App"))

ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback={<Spinner />}>
      <ThemeContext>
        <LazyApp />
        <ToastContainer newestOnTop />
      </ThemeContext>
    </Suspense>
  </Provider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
