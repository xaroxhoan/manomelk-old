import React, { useRef, useEffect } from "react"
import _ from "lodash"

function useDeepCompareEffect(callback, dependencies, condition) {
  const currentDependenciesRef = useRef()

  if (!_.isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies
  }

  useEffect(() => {
    if (condition) {
      callback()
    }
  }, [currentDependenciesRef.current])
}

export default useDeepCompareEffect
