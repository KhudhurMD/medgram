import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { memo, useEffect } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import { useAppDispatch, useAppSelector } from '../../../../store/storeHooks';
import { ReactFlowCustomEdges, ReactFlowCustomNodes, ReactFlowGraphOptions } from '../../../../types/ReactFlow';
import { graphSlice } from './slice';
import { AppDispatch } from '../../../../store/store';
import { textEditorSlice } from '../TextEditor/slice';
import { useMediaQuery } from 'usehooks-ts';
import posthog from 'posthog-js';
import { appObserver, NODE_CLICK_COMMAND } from '../../../../utils/appcommands';
import { alertSlice } from '../../../elements/alert/slice';

const Graph = (): JSX.Element => {
  const [parsedNodes, parsedEdges, parsedOptions] = useAppSelector((state) => [state.graph.nodes, state.graph.edges, state.graph.options]);

  const { shouldLayout, shouldResize } = useAppSelector((state) => state.graph.instance);
  const { layout } = parsedOptions;

  const dispatch = useAppDispatch();

  const reactFlowInstance = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(parsedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(parsedEdges);
  const isNotMobile = useMediaQuery('(min-width: 768px)');
  const canEdit = useAppSelector((state) => state.graph.canEdit);

  useEffect(() => {
    setNodes(parsedNodes);
  }, [JSON.stringify(parsedNodes)]);

  useEffect(() => {
    setEdges(parsedEdges);
  }, [JSON.stringify(parsedEdges)]);

  useEffect(() => {
    // dispatch(graphSlice.actions.layoutingTriggered())
  }, [JSON.stringify(parsedEdges)]);

  useEffect(() => {
    if (shouldLayout) {
      layoutGraph(parsedNodes, parsedEdges, parsedOptions, reactFlowInstance, dispatch);
      setTimeout(() => {
        reactFlowInstance.fitView({ duration: 500 });
      }, 50);
    }
  }, [shouldLayout]);

  useEffect(() => {
    if (shouldResize) {
      setTimeout(() => {
        reactFlowInstance.fitView({ duration: 500 });
      }, 0);
      dispatch(graphSlice.actions.resizingFinished());
    }
  }, [shouldResize]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={isNotMobile && canEdit ? onNodesChange : undefined}
      onEdgesChange={isNotMobile && canEdit ? onEdgesChange : undefined}
      nodeTypes={ReactFlowCustomNodes}
      className="graph"
      edgeTypes={ReactFlowCustomEdges}
      onNodeClick={(event, node) => {
        // ampli.clickedOnAGraphNode()
        posthog.capture('clicked on a graph node');
        appObserver.dispatch(NODE_CLICK_COMMAND, { nodeId: node.id });
      }}
      onNodeDoubleClick={(event, node) => {
        dispatch(alertSlice.actions.showAlert('👆 Please edit the text on the left (bullet points) edit the graph.'));
      }}
      onNodeMouseEnter={(event, node) => {
        // ampli.hoveredOverAGraphNode()
        posthog.capture('hovered over a graph node');
        dispatch(textEditorSlice.actions.selectedNodeChanged(node.id));
        dispatch(graphSlice.actions.nodePositionsChanged(nodes));
      }}
      onNodeMouseLeave={(event, node) => {
        dispatch(textEditorSlice.actions.selectedNodeChanged(null));
        dispatch(graphSlice.actions.nodePositionsChanged(nodes));
      }}
      snapGrid={[5, 5]}
      panOnScroll={isNotMobile}
      selectionOnDrag={isNotMobile}
      fitView
      minZoom={0.01}
      zoomOnPinch={isNotMobile}
      proOptions={{ hideAttribution: true, account: '' }}
    >
      <Background color="#ccc" variant={BackgroundVariant.Dots} gap={18} size={2} />
      <Controls showInteractive={false} position="top-right" />
    </ReactFlow>
  );
};

export const layoutGraph = (
  parsedNodes: Node[],
  parsedEdges: Edge[],
  graphOptions: ReactFlowGraphOptions,
  instance: ReactFlowInstance,
  dispatch: AppDispatch
) => {
  try {
    // set node and rank separation if provided in the options
    const parsedNodesWithDimensions: Node[] = [];
    const dagreInstance = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    const { layout } = graphOptions;
    const renderedNodes = instance.getNodes();
    dagreInstance.setGraph({
      nodesep: layout?.nodesep ?? 40,
      ranksep: layout?.ranksep ?? 40,
    });
    let subtractedHeightToCenter = 0;
    // Freezing disables graph layouting
    if (true == true) {
      parsedNodes.forEach((node, index) => {
        const renderedNode = renderedNodes[index];
        if (renderedNode && renderedNode.width && renderedNode.height) {
          // if every parsed node corresponds to a rendered node, queue it up for layouting in Dagre
          dagreInstance.setNode(node.id, {
            width: renderedNode.width,
            height: renderedNode.height,
          });
        } else {
          // if there are nodes without dimensions, give them initial dimensions, render and use the rendered dimensions for layouting
          dagreInstance.setNode(node.id, { width: 170, height: 40 });
          // console.log("Node doesn't have dimensions, using default dimensions")
          // setTimeout(() => {
          //   dispatch(graphSlice.actions.layoutingTriggered())
          // }, 10)
        }
      });

      parsedEdges.forEach((edge) => {
        //   if (edge.data.shouldLayout) {
        dagreInstance.setEdge(edge.source, edge.target);
        //   }
      });
      dagre.layout(dagreInstance);

      parsedNodes.forEach((node, index) => {
        const renderedNode = renderedNodes[index];
        if (renderedNode && renderedNode.height) {
          subtractedHeightToCenter = renderedNode.height / 2;
        } else {
          subtractedHeightToCenter = 20;
        }
        const dagreNodeWithPosition = dagreInstance.node(node.id);
        if (dagreNodeWithPosition) {
          const nodeWithPosition = Object.assign({}, node);
          nodeWithPosition.position = {
            x: dagreNodeWithPosition.x,
            y: dagreNodeWithPosition.y - subtractedHeightToCenter,
          };
          parsedNodesWithDimensions.push(nodeWithPosition);
        }
      });
    } else {
      // if graph is frozen, copy the previously rendered nodes positions
      parsedNodes.forEach((node, index) => {
        const RenderedNodeWithDimensions = renderedNodes[index];
        if (RenderedNodeWithDimensions) {
          const nodeWithPosition = Object.assign({}, node);
          nodeWithPosition.position = {
            x: RenderedNodeWithDimensions.position.x,
            y: RenderedNodeWithDimensions.position.y,
          };
          parsedNodesWithDimensions.push(nodeWithPosition);
        }
      });
    }
    dispatch(graphSlice.actions.nodePositionsChanged(parsedNodesWithDimensions));
    dispatch(graphSlice.actions.layoutingFinished());
  } catch (e: any) {
    console.error(e.message);
  }
};

function GraphWithProvider(): JSX.Element {
  return (
    <ReactFlowProvider>
      <div className="layoutflow graph h-full w-full">
        <Graph />
      </div>
    </ReactFlowProvider>
  );
}

export default memo(GraphWithProvider);
