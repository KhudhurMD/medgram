import type { Edge, Node, NodeTypes } from 'reactflow';
import { CustomEdge } from '../components/modules/editor/Graph/extensions/CustomEdges';
import { defaultNode, compoundNode, descriptionNode } from '../components/modules/editor/Graph/extensions/CustomNodes';
import { CustomNode } from '../components/modules/vizeditor/CustomNode';

export interface ReactFlowNode extends Node {
  data: {
    label: string;
    sublabel?: string;
    classes?: string;
    children?: ReactFlowNode[] | Node[];
  };
}

export type ReactFlowEdge = Edge;

export interface ParsedValuesReactFlow {
  parsedOptions: ReactFlowGraphOptions;
  parsedNodes: ReactFlowNode[];
  parsedEdges: ReactFlowEdge[];
}

export interface ReactFlowGraphOptions {
  title?: string;
  author?: string;
  styles?: Object;
  layout?: {
    nodesep?: number;
    ranksep?: number;
    freeze?: boolean;
  };
}

export const ReactFlowCustomNodes: NodeTypes = {
  defaultNode: defaultNode,
  compoundNode: compoundNode,
  descriptionNode: descriptionNode,
  customNode: CustomNode,
};

export const ReactFlowCustomEdges = {
  CustomEdge: CustomEdge,
};

export const ReactFlowCustomNodesTypes = {
  defaultNode: 'defaultNode',
  compoundNode: 'compoundNode',
  descriptionNode: 'descriptionNode',
  subLabelNode: 'subLabelNode',
};

export const ReactFlowCustomEdgeTypes = { customEdge: CustomEdge };
