import dagre from 'dagre';
import React, { useCallback, useEffect } from 'react';

import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import { useDebounce, useMediaQuery } from 'usehooks-ts';
import { useAppDispatch } from '../../../store/storeHooks';
import {
  appObserver,
  NODE_ADD_CHILD_COMMAND,
  NODE_ADD_SIBLING_COMMAND,
  NODE_SET_CONTENT_COMMAND,
  NODE_SET_SELECTION_COMMAND,
} from '../../../utils/appcommands';
import { Banner } from '../../elements/banner';
import { DesktopOnlyBanner } from '../../elements/desktopOnlyBanner';
import GraphMetadataV2 from '../editor/GraphMetadataV2';
import { CustomNode } from './CustomNode';
import Sidebar from './Sidebar';
import { graphV2Slice } from './slice';
import { EditorProvider, useGlobalEditor } from './TextEditorContextProvider';

const nodeTypes = { customNode: CustomNode };

const VisualEditor = (props: { initialNodes: Node[]; initialEdges: Edge[]; viewOnly?: boolean }) => {
  const { initialNodes, initialEdges } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const debouncedNodes = useDebounce(nodes, 1000);
  const { editor } = useGlobalEditor();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const viewOnly = props.viewOnly;

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        return addEdge(params, eds);
      });
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);
      if (!sourceNode || !targetNode) return;

      setNodes((nds) => {
        return nds.map((node) => {
          if (node.id === targetNode.id) {
            if (!sourceNode.positionAbsolute || !targetNode.positionAbsolute) return node;

            const position = {
              x: targetNode.positionAbsolute.x - sourceNode.positionAbsolute.x,
              y: targetNode.positionAbsolute.y - sourceNode.positionAbsolute.y,
            };

            console.log(`Target Node Connected`);
            return {
              ...node,
              data: { ...node.data },
              parentId: sourceNode.id,
              position,
            };
          }
          return node;
        });
      });
    },
    [setEdges, setNodes, nodes]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const node = (e.target as HTMLElement).closest('.react-flow__node');
    const nodeId = node?.getAttribute('data-id');
    const isEditable = editor?.isFocused;

    const focusNode = (nodeId: string) => {
      const nodeByDataId = document.querySelector(`[data-id="${nodeId}"]`) as HTMLElement | undefined;
      nodeByDataId?.focus();
    };

    if (!nodeId) return;
    if (isEditable) return;

    if (e.key === 'Enter') {
      appObserver.dispatch(NODE_ADD_CHILD_COMMAND, { nodeId });
    }

    if (e.key === 'Tab') {
      const parent = edges.find((edge) => edge.target === nodeId)?.source;
      if (!parent) return;
      appObserver.dispatch(NODE_ADD_CHILD_COMMAND, { nodeId: parent });
      e.preventDefault();
      e.stopPropagation();
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      document.body.focus();
      const parent = edges.find((edge) => edge.target === nodeId)?.source;
      if (!parent) return;
      appObserver.dispatch(NODE_SET_SELECTION_COMMAND, { nodeId: parent });
      focusNode(parent);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      const child = edges.find((edge) => edge.source === nodeId)?.target;
      if (!child) {
        return;
      }
      appObserver.dispatch(NODE_SET_SELECTION_COMMAND, { nodeId: child });
      focusNode(child);
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      const currentNode = nodes.find((node) => node.id === nodeId);
      const parent = edges.find((edge) => edge.target === nodeId)?.source;
      if (!parent) return;
      const siblings = edges.filter((edge) => edge.source === parent && edge.target !== nodeId);
      const sibling = siblings.reduce(
        (acc, edge) => {
          const sibling = nodes.find((node) => node.id === edge.target);
          if (!sibling) return acc;
          const siblingX = sibling.position?.x ?? (0 as number);
          const currentNodeX = currentNode?.position?.x ?? (0 as number);
          console.log({ sibling, currentNode });
          console.log({ siblingX, currentNodeX });
          const gap = siblingX - currentNodeX;
          if (gap > 0) {
            if (gap < acc.gap) {
              return { gap, sibling: sibling.id };
            }
          }
          return acc;
        },
        { gap: Infinity, sibling: '' }
      ).sibling;

      console.log('sibling');
      console.log(sibling);

      if (!sibling) return;
      appObserver.dispatch(NODE_SET_SELECTION_COMMAND, { nodeId: sibling });
      focusNode(sibling);
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      const currentNode = nodes.find((node) => node.id === nodeId);
      const parent = edges.find((edge) => edge.target === nodeId)?.source;
      if (!parent) return;

      const siblings = edges.filter((edge) => edge.source === parent && edge.target !== nodeId);
      const sibling = siblings.reduce(
        (acc, edge) => {
          const sibling = nodes.find((node) => node.id === edge.target);
          if (!sibling) return acc;
          const siblingX = sibling.position?.x ?? (0 as number);
          const currentNodeX = currentNode?.position?.x ?? (0 as number);
          const gap = siblingX - currentNodeX;
          if (gap < 0) {
            if (Math.abs(gap) < Math.abs(acc.gap)) {
              return { gap, sibling: sibling.id };
            }
          }
          return acc;
        },
        { gap: Infinity, sibling: '' }
      ).sibling;
      if (!sibling) return;
      appObserver.dispatch(NODE_SET_SELECTION_COMMAND, { nodeId: sibling });
      focusNode(sibling);
    }

    if (e.key === 'i') {
      const node = document.querySelector(`[data-nodeid="${nodeId}"]`);
      node?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    }
  };

  const reactFlowInstance = useReactFlow();
  const api = useStoreApi();
  const dispatch = useAppDispatch();

  useEffect(() => {
    appObserver.subscribe(NODE_ADD_CHILD_COMMAND, ({ nodeId }) => {
      const { newNodes, newEdges, newNodeId } = addChildNode({ nodes, edges, nodeId });
      setNodes(newNodes);
      setEdges(newEdges);
      setTimeout(() => {
        api.getState().resetSelectedElements();
        api.getState().addSelectedNodes([newNodeId]);
        const node = document.querySelector(`[data-nodeid="${newNodeId}"]`);
        node?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      }, 100);
      return true;
    });

    appObserver.subscribe(NODE_ADD_SIBLING_COMMAND, ({ nodeId }) => {
      const parentNode = edges.find((edge) => edge.target === nodeId)?.source;
      if (!parentNode) return true;
      appObserver.dispatch(NODE_ADD_CHILD_COMMAND, { nodeId: parentNode });
      return true;
    });

    appObserver.subscribe(NODE_SET_CONTENT_COMMAND, ({ nodeId, content }) => {
      const updatedNodes = nodes.map((node) => {
        if (node.id === nodeId && content) {
          return {
            ...node,
            data: { ...node.data, content },
          };
        }
        return node;
      });
      dispatch(graphV2Slice.actions.setGraph({ nodes: updatedNodes, edges }));
      setNodes(updatedNodes);
      return true;
    });

    appObserver.subscribe(NODE_SET_SELECTION_COMMAND, ({ nodeId }) => {
      api.getState().resetSelectedElements();
      setTimeout(() => {
        api.getState().addSelectedNodes([nodeId]);
      }, 0);
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, setNodes, setEdges]);

  useEffect(() => {
    setTimeout(() => {
      reactFlowInstance?.fitView({
        duration: 200,
        padding: 0.5,
      });
    }, 100);
  }, [reactFlowInstance]);

  useEffect(() => {
    dispatch(graphV2Slice.actions.setGraph({ nodes, edges }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNodes]);

  return (
    <div className="flex flex-row w-full h-full relative">
      <div className="w-full h-[90vh] sm:h-[100vh] relative">
        <div className="w-full relative">{!viewOnly && <GraphMetadataV2 />}</div>

        {!isMobile && <Banner />}
        {isMobile && <DesktopOnlyBanner />}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          disableKeyboardA11y={true}
          onEdgesChange={onEdgesChange}
          onEdgesDelete={(edgesToDelete) => {
            edgesToDelete.forEach((edge) => {
              setEdges((e) => e.filter((item) => item.id !== edge.id));
              const targetNode = nodes.find((node) => node.id === edge.target);
              if (!targetNode) return;

              if (!targetNode.positionAbsolute) return;

              const position = { x: targetNode.positionAbsolute?.x, y: targetNode.positionAbsolute?.y };

              setNodes((n) =>
                n.map((node) => {
                  if (node.id === targetNode.id) {
                    console.log({ ...node, parentId: undefined, position });
                    return { ...node, parentId: undefined, position };
                  } else {
                    console.log(node);
                    return node;
                  }
                })
              );
            });
          }}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          selectionOnDrag={true}
          panOnDrag={isMobile}
          panOnScroll={true}
          proOptions={{ hideAttribution: true, account: '' }}
          nodesFocusable={!viewOnly}
          className={viewOnly ? 'view-only-graph' : ''}
          nodesDraggable={!viewOnly}
          onKeyDown={onKeyDown}
          nodesConnectable={!viewOnly}
          minZoom={0.01}
        >
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
      {!viewOnly && !isMobile && (
        <div className="flex-1">
          <div className="w-[350px] bg-white px-5 py-1 border-l border-dashed h-full flex-1">
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
};

export const VisualEditorWithProvider = ({
  initialNodes,
  initialEdges,
  viewOnly,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
  viewOnly?: boolean;
}) => (
  <EditorProvider>
    <ReactFlowProvider>
      <VisualEditor initialNodes={initialNodes} initialEdges={initialEdges} viewOnly={viewOnly} />
    </ReactFlowProvider>
  </EditorProvider>
);

const addChildNode = ({ nodes, edges, nodeId }: { nodes: Node[]; edges: Edge[]; nodeId: string }) => {
  const newNode = {
    id: new Date().getTime().toString(),
    type: 'customNode',
    position: placeChildNode({ nodes, edges, nodeId }),
    data: { content: `<p>&nbsp;</p>` },
    parentId: nodeId,
  };

  const newEdge = { id: `e-${nodeId}-${newNode.id}`, source: nodeId, target: newNode.id };

  return {
    newNodes: [...nodes, newNode],
    newEdges: [...edges, newEdge],
    newNodeId: newNode.id,
  };
};

export const layoutGraph = ({ nodes, edges }: { nodes: Node<any>[]; edges: Edge<any>[] }) => {
  try {
    // set node and rank separation if provided in the options
    const nodesWithLayout: Node[] = [];
    const dagreInstance = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

    dagreInstance.setGraph({
      nodesep: 40,
      ranksep: 40,
    });

    let subtractedHeightToCenter = 0;

    // Freezing disables graph layouting
    nodes.map((node) => {
      dagreInstance.setNode(node.id, {
        width: node.width ?? 170,
        height: node.height ?? 40,
      });
    });
    edges.forEach((edge) => {
      dagreInstance.setEdge(edge.source, edge.target);
    });
    dagre.layout(dagreInstance);

    nodes.forEach((node) => {
      if (node && node.height) {
        subtractedHeightToCenter = node.height / 2;
      } else {
        subtractedHeightToCenter = 20;
      }
      const dagreNodeWithPosition = dagreInstance.node(node.id);
      if (dagreNodeWithPosition) {
        const nodeWithPosition = Object.assign({}, node);
        if (node.parentId) {
          const parent = dagreInstance.node(node.parentId);
          nodeWithPosition.position = {
            x: dagreNodeWithPosition.x - parent.x - parent.width / 2 + 170 / 2,
            y: dagreNodeWithPosition.y - subtractedHeightToCenter + 100 / 2 - parent.y,
          };
        } else {
          nodeWithPosition.position = {
            x: dagreNodeWithPosition.x + 100,
            y: dagreNodeWithPosition.y - subtractedHeightToCenter + 100,
          };
        }
        nodesWithLayout.push(nodeWithPosition);
      }
    });

    return nodesWithLayout;
  } catch (error) {
    console.error('Error while layouting graph', error);
  }
};

export const placeChildNode = ({ nodes, edges, nodeId }: { nodes: Node<any>[]; edges: Edge<any>[]; nodeId: string }) => {
  // Put the child node in a free spot below the parent node
  // If free space place directly below
  // If not place to the right or left of the parent node

  const siblingNodes = edges.filter((edge) => edge.source === nodeId).map((edge) => nodes.find((node) => node.id === edge.target));

  // 2. find where the gap is in the sibling nodes relative to the parent node x
  const shouldPlaceCenter = siblingNodes.length === 0;

  const accum = siblingNodes.reduce(
    (acc, siblingNode) => {
      // calculate sibling x - parent x
      // then accumulate the result
      // check if the gap is then positive
      // if positive then place the child node to the right of the parent node
      const siblingX = siblingNode?.position.x ?? 0;

      const gap = siblingX;

      if (gap > 0) {
        // console.log(`Gap is positive: ${gap}`);
        // console.log(`Max X Right: ${acc.maxXRight < gap ? gap : acc.maxXRight}`);
        return {
          ...acc,
          maxXRight: Math.abs(gap) > acc.maxXRight ? Math.abs(gap) : acc.maxXRight,
        };
      } else {
        // console.log(`Gap is negative: ${gap}`);
        // console.log(`Max X Left: ${Math.abs(gap) > acc.maxXLeft ? Math.abs(gap) : acc.maxXLeft}`);

        return {
          ...acc,
          maxXLeft: Math.abs(gap) > acc.maxXLeft ? Math.abs(gap) : acc.maxXLeft,
        };
      }
    },
    {
      maxXRight: 0,
      maxXLeft: 0,
    }
  );

  const shouldPlaceRight = Math.abs(accum.maxXRight) < Math.abs(accum.maxXLeft);

  const parent = nodes.find((node) => node.id === nodeId);
  const childY = Math.max((parent?.height ?? 0) + 50);
  const childX = shouldPlaceCenter ? 0 : shouldPlaceRight ? 0 + accum.maxXRight + 200 : 0 - accum.maxXLeft - 200;

  return { x: childX, y: childY };
};

export default VisualEditorWithProvider;
