import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { textEditorSlice, TextEditorState } from '../TextEditor/slice';
import { ReactFlowEdge, ReactFlowGraphOptions, ReactFlowNode } from '../../../../types/ReactFlow';
import { ReactFlowAdapter } from '../../../../utils/reactflowadapter';
import { newGraphCreatedAction } from '../../../../store/store';
import { initialGraphState } from '../TextEditor/misc/constants';

export interface GraphState {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  options: ReactFlowGraphOptions;
  instance: ReactFlowInstanceActions;
  canEdit: boolean;
}

interface ReactFlowInstanceActions {
  shouldLayout?: boolean;
  shouldResize?: boolean;
  shouldFitView?: boolean;
  shouldZoomIn?: boolean;
  shouldZoomOut?: boolean;
}

const initialState: GraphState = {
  nodes: [],
  edges: [],
  options: {
    layout: {
      nodesep: 40,
      ranksep: 40,
    },
  },
  instance: {
    shouldLayout: true,
    shouldResize: true,
  },
  canEdit: true,
};
export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    layoutingTriggered: (state, _action: PayloadAction<undefined>) => {
      state.instance.shouldLayout = true;
    },
    layoutingFinished: (state, _action: PayloadAction<undefined>) => {
      state.instance.shouldLayout = false;
    },
    resizingTriggered: (state, _action: PayloadAction<undefined>) => {
      state.instance.shouldResize = true;
    },
    resizingFinished: (state, _action: PayloadAction<undefined>) => {
      state.instance.shouldResize = false;
    },
    nodePositionsChanged: (state, action: PayloadAction<ReactFlowNode[]>) => {
      state.nodes = action.payload;
    },
    disableEditing: (state, _action: PayloadAction<undefined>) => {
      state.canEdit = false;
    },
    freezeGraph: (state, _action: PayloadAction<undefined>) => {
      if (!state.options.layout) state.options.layout = {};
      state.options.layout.freeze = true;
    },
    unfreezeGraph: (state, _action: PayloadAction<undefined>) => {
      if (!state.options.layout) state.options.layout = {};
      state.options.layout.freeze = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(textEditorSlice.actions.userChangedInput, (state, action: PayloadAction<TextEditorState>) => {
        // if node count changed, layout graph
        const parsedNodes = action.payload.parsedNodes.map((parsedNode, index) => ReactFlowAdapter().transformNode(parsedNode));
        const parsedNodesWithPreviousPosition = copyPreviousNodePositions(state.nodes, parsedNodes);
        const parsedEdges = action.payload.parsedEdges.map((parsedEdge, index) => ReactFlowAdapter().transformEdge(parsedEdge));

        state.nodes = parsedNodesWithPreviousPosition;
        state.edges = parsedEdges;
      })
      .addCase(newGraphCreatedAction, (state) => {
        const initState = JSON.parse(initialGraphState);
        state.nodes = initState.nodes;
        state.edges = initState.edges;
        state.options = initState.options;
        state.canEdit = true;
      });
    // .addCase(loadGraphAction, (state) => {
    //   state.instance.shouldLayout = true
    // })
  },
});

function copyPreviousNodePositions(oldNodes: ReactFlowNode[], newNodes: ReactFlowNode[]): ReactFlowNode[] {
  return newNodes.map((newNode, index) => {
    const oldNodeWithPosition = oldNodes[index];
    if (oldNodeWithPosition) {
      newNode.position = oldNodeWithPosition.position;
    }
    return newNode;
  });
}

export default graphSlice.reducer;
