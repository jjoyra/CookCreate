import { createSlice } from '@reduxjs/toolkit'
import { shareScreen } from './video-thunk'

const initialState = {
  screenShareActive: false,
  shareScreenPublisher: null,
}

export const screenShare = createSlice({
  name: 'screenShare',
  initialState,
  reducers: {
    setScreenShareActive: (state, { payload }) => {
      state.screenShareActive = payload
    },
    setShareScreenPublisher: (state, { payload }) => {
      state.shareScreenPublisher = payload
    },
    initScreenShare: (state) => {
      state.screenShareActive = false
      state.shareScreenPublisher = null
    }
  },
  extraReducers: {
    [shareScreen.fulfilled]: (state, { payload }) => {
      console.log("공유 화면 퍼블리셔 저장 성공", payload)
      state.shareScreenPublisher = payload
    },
    [shareScreen.rejected]: (state, { payload }) => {
      console.log("공유 화면 퍼블리셔 저장 실패", payload)
    }
  }
})

export const {
  setScreenShareActive, setShareScreenPublisher, initScreenShare
} = screenShare.actions
export default screenShare.reducer