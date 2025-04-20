import { createSlice } from '@reduxjs/toolkit'

interface StyleEditorState {
  text: string
  visible: boolean
}
const initialState: StyleEditorState = {
  text: '',
  visible: false,
}
export const styleEditorSlice = createSlice({
  name: 'styleEditor',
  initialState,
  reducers: {
    toggle: (state: StyleEditorState) => {
      state.visible = !state.visible
    },
  },
})

export default styleEditorSlice.reducer
