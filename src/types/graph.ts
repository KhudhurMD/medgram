import { z } from 'zod';
import { ReactFlowNode, ReactFlowEdge } from './ReactFlow';

export interface GraphComponentProps {
  parsedNodes: ReactFlowNode[];
  parsedEdges: ReactFlowEdge[];
  parsedOptions: Object;
  shouldResize?: number;
  setHoverLineNumber?: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export interface lastWorkingValues<N, E, O> {
  parsedContent: string; ///
  parsedGraphOptions: O;
  parsedNodesWithoutDimensions?: N[];
  parsedEdgesWithoutDimensions?: E[];
}

export const GraphDataSchema = z.object({
  graph: z.object({
    nodes: z.array(z.object({})),
    edges: z.array(z.object({})),
  }),
  graphmetadata: z.object({
    id: z.string(),
    name: z.string(),
    date: z.string(),
  }),
  texteditor: z.object({}),
  styleeditor: z.object({}),
});

export const GraphSchema = z.object({
  id: z.string(),
  name: z.string(),
  updatedAt: z.string().optional(),
  graphData: z.string(),
  userId: z.string().optional(),
  anonymousId: z.string().optional(),
  editorVersion: z.string().optional(),
});

export const CommunityGraphSchema = z.object({
  graphData: z.string(),
  graphId: z.string(),
});

export const GraphDataLocalStorageSchema = z.array(z.tuple([z.string(), GraphDataSchema]));

export type GraphSchemaType = z.infer<typeof GraphSchema>;
export type GraphDataSchemaType = z.infer<typeof GraphDataSchema>;
export type GraphDataLocalStorageSchema = z.infer<typeof GraphDataLocalStorageSchema>;
