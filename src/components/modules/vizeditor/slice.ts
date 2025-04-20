import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { newGraphCreatedAction } from '../../../store/store';
import { ReactFlowNode, ReactFlowEdge, ReactFlowGraphOptions } from '../../../types/ReactFlow';
import { initialGraphState } from '../editor/TextEditor/misc/constants';

export interface GraphV2State {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  options: ReactFlowGraphOptions;
  canEdit: boolean;
}

const initialState: GraphV2State = {
  nodes: [],
  edges: [],
  options: {
    layout: {
      nodesep: 40,
      ranksep: 40,
    },
  },
  canEdit: true,
};
export const graphV2Slice = createSlice({
  name: 'graph_v2',
  initialState,
  reducers: {
    setGraph: (state, action: PayloadAction<{ nodes: ReactFlowNode[]; edges: ReactFlowEdge[] }>) => {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(newGraphCreatedAction, (state) => {
      const initState = JSON.parse(initialGraphState);
      state.nodes = initState.nodes;
      state.edges = initState.edges;
      state.options = initState.options;
      state.canEdit = true;
    });
  },
});

export default graphV2Slice.reducer;
