import { createSlice } from '@reduxjs/toolkit'

interface SyncState {
  shouldSync: boolean
}
const initialState: SyncState = {
  shouldSync: false,
}
export const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    resumeSync: (state) => {
      state.shouldSync = true
    },
    pauseSync: (state) => {
      state.shouldSync = false
    },
  },
})

export default syncSlice.reducer
