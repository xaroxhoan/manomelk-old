import React from 'react'

const BlogContext = React.createContext({
    state: {},
    setState: _ => {},
    resetState: _ => {}
})

export default BlogContext