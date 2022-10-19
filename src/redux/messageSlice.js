import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  page: 1,
  totalPages: 1,
  perPage: 10,
  messages: [],
  defaultInfo: null,
  me: {},
  message: '',
  successMessage: '',
  errors: {}
}

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessagePage: (state, action) => {
      state.page = action.payload
    },
    setMessageTotalPages: (state, action) => {
      state.totalPages = action.payload
    },
    setMessagePerPage: (state, action) => {
      state.perPage = action.payload
    },
    setMessages: (state, action) => {
      state.messages = [...action.payload]
    },
    appendMessages: (state, action) => {
      state.messages = [...state.messages, ...action.payload]
    },
    prependMessages: (state, action) => {
      state.messages = [...action.payload, ...state.messages]
    },
    setMessageDefaultInfo: (state, action) => {
      state.defaultInfo = action.payload
    },
    setMessageMe: (state, action) => {
      state.me = action.payload
    },
    setMessageMessage: (state, action) => {
      state.message = action.payload
    },
    setMessageSuccessMessage: (state, action) => {
      state.successMessage = action.payload
    },
    setMessageErrors: (state, action) => {
      state.errors = {...action.payload}
    },
    setMessageState: (state, action) => {
      for (const key of Object.keys(action.payload)) {
        state[key] = action.payload[key]
      }
      state.totalPages = action.payload.totalPages
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setMessagePage,
  setMessageTotalPages,
  setMessagePerPage,
  setMessages,
  appendMessages,
  prependMessages,
  setMessageDefaultInfo,
  setMessageMe,
  setMessageMessage,
  setMessageSuccessMessage,
  setMessageErrors,
  setMessageState
} = messageSlice.actions

export default messageSlice.reducer