import { useLocation, useHistory } from "react-router"

export const useQueryParams = () => {
  return new URLSearchParams(useLocation().search)
}

export const useQueryRemove = () => {
  const history = useHistory()
  const queryParams = useQueryParams()
  return (...queryNames) => {
    queryNames.forEach(q => queryParams.delete(q))
    history.replace({
      search: queryParams.toString()
    })
  }
}
