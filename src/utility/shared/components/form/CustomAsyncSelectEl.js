import React, { useState } from "react"
import "@styles/react/libs/react-select/_react-select.scss"
import AsyncSelect from "react-select/async"
import { useDebouncedCallback } from "use-debounce"
import { FormFeedback, Label } from "reactstrap"
import { jwtAxios, selectThemeColors } from "@utils"
import { Controller } from "react-hook-form"
import classNames from "classnames"

function CustomAsyncSelectEl({ methods, name, label, url, callback, defaultValue, ...props }) {
  const [isLoading, setIsLoading] = useState(false)
  const debounced = useDebouncedCallback(callback => callback(), 1000)

  const debouncedFetch = inputValue => {
    return new Promise((resolve, reject) => {
      debounced(async () => {
        setIsLoading(true)
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
        setIsLoading(false)
      })
    })
  }

  const loadOptions = inputValue => {
    return debouncedFetch(inputValue)
  }

  const handleDefaultValue = () => {
    if (defaultValue !== undefined) {
      methods.setValue(name, defaultValue)
      return defaultValue
    } else {
      return ""
    }
  }

  return (
    <>
      <Label>{label}</Label>
      <Controller
        control={methods.control}
        name={name}
        render={({ field }) => (
          <AsyncSelect
            placeholder="search..."
            isClearable
            catchOptions
            className={classNames("react-select", {
              "is-invalid": methods.formState.errors[`${name}`]?.value?.message
            })}
            classNamePrefix="select"
            theme={selectThemeColors}
            loadOptions={loadOptions}
            onChange={e => methods.setValue(name, e)}
            {...field}
            loadingMessage={e => <span>{e.inputValue}</span>}
            isLoading={isLoading}
            defaultValue={handleDefaultValue}
            {...props}
          />
        )}
      />
      {methods.formState.errors[`${name}`] && (
        <FormFeedback>{methods.formState.errors[`${name}`]?.value?.message}</FormFeedback>
      )}
    </>
  )
}

export default CustomAsyncSelectEl
