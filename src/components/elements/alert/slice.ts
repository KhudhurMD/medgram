import { createSlice } from '@reduxjs/toolkit';

interface AlertState {
  visible: boolean;
  message: string;
}
const initialState: AlertState = {
  visible: false,
  message: '',
};

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action) => {
      state.visible = true;
      state.message = action.payload;
    },
    hideAlert: (state) => {
      state.visible = false;
      state.message = '';
    },
  },
});

export default alertSlice.reducer;
