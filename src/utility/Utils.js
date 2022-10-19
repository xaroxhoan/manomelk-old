import axios from "axios"
// -------------------- Api Config

export const jwtAxios = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_BASE_URL_DEV :  process.env.REACT_APP_API_BASE_URL_PROD
})
// -------------------- Pagination Props
export const DEFAULT_PAGE_NUMBER = 1
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGE_SORT = "createdAt"
export const DEFAULT_SORT_ORDER = "DESC"

export const pageOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "30", value: 30 }
]
// -------------------- Notify
import { Slide, toast } from "react-toastify"

export function notify(type, message) {
  toast[type](message, {
    icon: true,
    transition: Slide,
    hideProgressBar: true,
    autoClose: 2000
  })
}
// -------------------- Api Pagination Propeties Generator
export const ApiPageOptionsCreator = response => {
  const { hasNextPage, hasPrevPage, limit, page: currentPage, total, totalPages } = response?.data || {}
  return { hasNextPage, hasPrevPage, limit, currentPage, total, totalPages }
}
// -------------------- Confirm Modal
import swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

export const DeleteConfirmation = (callback, reloadData) => {
  const MySwal = withReactContent(swal)

  MySwal.fire({
    title: "Are you sure?",
    text: "It is impossible to recover after deletion!",
    icon: "error",
    showCancelButton: true,
    cancelButtonText: "cancel",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "delete!",
    customClass: { cancelButton: "mx-1 my-2", confirmButton: "mx-1 my-2" }
  }).then(result => {
    if (result.isConfirmed) {
      callback().then(({ message }) => {
        notify("success", message.message)
        reloadData()
      })
    }
  })
}

export const ConfirmModal = (callback, reloadData, title) => {
  const MySwal = withReactContent(swal)

  MySwal.fire({
    title,
    showCancelButton: true,
    cancelButtonText: "cancel",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "apply",
    customClass: { cancelButton: "mx-1 my-2", confirmButton: "mx-1 my-2", title: "mt-3" }
  }).then(result => {
    if (result.isConfirmed) {
      callback().then(({ message }) => {
        notify("success", message.message)
        reloadData()
      })
    }
  })
}
// -------------------- DataTable
import { Spinner } from "reactstrap"

export const customStyles = {
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: "rgba(209, 211, 242, 0.77)",
      borderBottomColor: "#FFFFFF",
      outline: "1px solid #FFFFFF"
    }
  }
}

export const customLoader = () => (
  <>
    <div style={{ padding: "24px" }}>
      <Spinner />
    </div>
    <div>loading data...</div>
  </>
)
// -------------------- Map Callback
export const usersMapCallback = user => {
  return {
    label: (user.name + " " + user.family).concat(" - ", user.type),
    value: user._id
  }
}

export const CategoriesMapCallback = category => {
  return {
    label: category.title,
    value: category._id
  }
}

export const TagsMapCallback = tag => {
  return {
    label: tag.title,
    value: tag._id
  }
}

export const BrandsMapCallback = brand => {
  return {
    label: brand.title,
    value: brand._id
  }
}

export const ProductsMapCallback = product => {
  return {
    label: product.name,
    value: product._id
  }
}

export const UserTypeColors = {
  user: "light-primary",
  reseller: "light-info",
  superAdmin: "light-danger"
}


// --------------------
// --------------------
// --------------------
// --------------------
// --------------------
// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, "")

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: "short", day: "numeric", year: "numeric" }) => {
  if (!value) return value
  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: "short", day: "numeric" }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" }
  }

  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem("userData")
export const getUserData = () => JSON.parse(localStorage.getItem("userData"))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === "admin") return "/"
  if (userRole === "client") return "/access-control"
  return "/login"
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "#7367f01a", // for option hover bg-color
    primary: "#7367f0", // for selected option bg-color
    neutral10: "#7367f0", // for tags bg-color
    neutral20: "#ededed", // for input border-color
    neutral30: "#ededed" // for input hover border-color
  }
})