import React from "react"
import "@styles/react/libs/react-select/_react-select.scss"
import AsyncSelect from "react-select/async"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "reactstrap"
import { jwtAxios, selectThemeColors } from "@utils"

function CustomAsyncSelect({ onChangeItem, label, callback, url, ...props }) {
  const debounced = useDebouncedCallback(callback => {
    callback()
  }, 1000)

  const debouncedFetch = inputValue => {
    return new Promise((resolve, reject) => {
      debounced(async () => {
        try {
          const response = await jwtAxios.get(url, {
            params: {
              s: inputValue
            }
          })
          const options = response.data.data?.items || []
          resolve(options.map(callback))
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  const loadOptions = inputValue => {
    return debouncedFetch(inputValue)
  }

  return (
    <>
      <Label>{label}</Label>
      <AsyncSelect
        isClearable={true}
        theme={selectThemeColors}
        className="react-select"
        classNamePrefix="select"
        name="callback-react-select"
        catchOptions
        loadOptions={loadOptions}
        onChange={onChangeItem}
        placeholder="search ..."
        {...props}
      />
    </>
  )
}
export default CustomAsyncSelect
