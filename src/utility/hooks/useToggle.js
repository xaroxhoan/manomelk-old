import React, { useState, useCallback } from "react"

function useToggle(initialState = false) {
  const [state, setState] = useState(initialState)
  const toggle = useCallback(() => setState(state => !state), [])
  return [state, toggle]
}
export default useToggle
