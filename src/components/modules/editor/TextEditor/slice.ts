import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEdge, INode } from '../../../../types/parser';
import { initialEditorState } from './misc/constants';
import { newGraphCreatedAction } from '../../../../store/store';

export interface TextEditorState {
  parsedNodes: INode[];
  parsedEdges: IEdge[];
  userOptions: userOptions;
  editorState?: string;
  selectedNode?: string | null;
  debug?: boolean;
  toggleReloadEditor?: boolean;
}

const initialState: TextEditorState = {
  parsedNodes: [],
  parsedEdges: [],
  userOptions: {},
  selectedNode: null,
  debug: false,
  toggleReloadEditor: false,
};

export const textEditorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    userChangedInput: (state, action: PayloadAction<TextEditorState>) => {
      state.parsedNodes = action.payload.parsedNodes;
      state.parsedEdges = action.payload.parsedEdges;
      state.userOptions = action.payload.userOptions;
    },
    editorStateUpdated: (state, action: PayloadAction<string>) => {
      state.editorState = action.payload;
    },
    debugToggled: (state) => {
      state.debug = !state.debug;
    },
    selectedNodeChanged: (state, action: PayloadAction<string | null>) => {
      state.selectedNode = action.payload;
    },
    reloadEditor: (state) => {
      state.toggleReloadEditor = !state.toggleReloadEditor;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(newGraphCreatedAction, (state) => {
      state.editorState = initialEditorState;
    });
  },
});

interface userOptions {
  layout?: {
    nodesep?: number;
    ranksep?: number;
  };
}

export default textEditorSlice.reducer;
