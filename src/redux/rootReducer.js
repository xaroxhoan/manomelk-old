// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import socketSlice from './socketSlice'
import messageSlice from './messageSlice'

const rootReducer = {
  auth,
  navbar,
  layout,
  socket: socketSlice,
  message: messageSlice
}

export default rootReducer
