import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { textEditorSlice } from '../TextEditor/slice';
import { newGraphCreatedAction } from '../../../../store/store';

interface GraphMetadataState {
  name: string;
  author: string;
  date: string;
  id?: string;
  shouldSave?: boolean;
}

const initialState: GraphMetadataState = {
  name: 'Graph - ',
  author: '',
  date: dayjs().toString(),
  shouldSave: true,
};

export const graphMetadataSlice = createSlice({
  name: 'graphMetadata',
  initialState,
  reducers: {
    graphMetadataChanged: (state, action: PayloadAction<GraphMetadataState>) => {
      state.name = action.payload.name;
      state.author = action.payload.author;
      state.date = action.payload.date;
      if (action.payload.id) {
        state.id = action.payload.id;
      }
    },
    setGraphMetadataId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newGraphCreatedAction, (state, action) => {
        state.id = action.payload;
        state.name = 'Graph - ' + action.payload.slice(0, 4);
      })
      .addCase(textEditorSlice.actions.editorStateUpdated, (state) => {
        state.date = dayjs().toString();
      });
  },
});

export default graphMetadataSlice.reducer;
