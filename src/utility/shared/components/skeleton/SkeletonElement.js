import React from "react"
const SkeletonElement = ({ type = "text", className, style }) => {
  const classes = `skeleton sk-${type} ${className}`

  return <div className={classes} style={style}></div>
}

export default SkeletonElement
