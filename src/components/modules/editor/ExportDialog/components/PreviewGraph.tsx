import dagre from 'dagre';
import { Dispatch, memo, SetStateAction, useEffect } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Edge,
  Node,
  ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import { ReactFlowCustomEdges, ReactFlowCustomNodes, ReactFlowEdge, ReactFlowGraphOptions, ReactFlowNode } from '../../../../../types/ReactFlow';
import { EditorProvider } from '../../../vizeditor/TextEditorContextProvider';

interface PreviewGraphProps {
  parsedNodes: ReactFlowNode[];
  parsedEdges: ReactFlowEdge[];
  shouldLayout?: boolean;
}

export function PreviewGraph({ parsedNodes, parsedEdges, shouldLayout }: PreviewGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(parsedNodes);
  const [edges, _setEdges, onEdgesChange] = useEdgesState(parsedEdges);
  const instance = useReactFlow();

  useEffect(() => {
    if (shouldLayout && shouldLayout == true) {
      setTimeout(() => {
        layoutGraph(parsedNodes, parsedEdges, {}, instance, setNodes);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(parsedNodes), JSON.stringify(parsedEdges)]);

  useEffect(() => {
    setNodes(parsedNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(parsedNodes)]);

  useEffect(() => {
    setTimeout(() => {
      instance.fitView();
    }, 0);
  });

  return (
    <EditorProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        panOnScroll
        className="layoutflow"
        minZoom={0.01}
        nodeTypes={ReactFlowCustomNodes}
        edgeTypes={ReactFlowCustomEdges}
        proOptions={{ hideAttribution: true, account: '' }}
      >
        <Background color="#ccc" variant={BackgroundVariant.Dots} gap={18} size={2} />
      </ReactFlow>
    </EditorProvider>
  );
}

const layoutGraph = (
  parsedNodes: Node[],
  parsedEdges: Edge[],
  graphOptions: ReactFlowGraphOptions,
  instance: ReactFlowInstance,
  setNodes: Dispatch<SetStateAction<Node[]>>
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
    if (layout?.freeze != true) {
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
    setNodes(parsedNodesWithDimensions);
  } catch (e: any) {
    console.error(e.message);
  }
};

export function PreviewGraphProvider({ parsedNodes, parsedEdges, shouldLayout }: PreviewGraphProps) {
  return (
    <ReactFlowProvider>
      <PreviewGraph parsedNodes={parsedNodes} parsedEdges={parsedEdges} shouldLayout={shouldLayout} />
    </ReactFlowProvider>
  );
}

export default memo(PreviewGraphProvider);
