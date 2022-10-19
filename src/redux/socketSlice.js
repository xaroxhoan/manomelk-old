import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  instance: null
}

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setWebSocketInstance: (state, action) => {
      state.instance = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setWebSocketInstance } = socketSlice.actions

export default socketSlice.reducer