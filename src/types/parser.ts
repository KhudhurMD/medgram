export interface INode {
  id: string
  label: string
  classes?: string
  sublabel?: string
  parent?: string
  position?: { x: number; y: number }
  body?: string
  bodyClasses?: string
  type: NodeType
  compoundChildren?: INode[]
}

export interface IEdge {
  id: string
  label?: string
  source: string
  target: string
  isCompound: boolean
  type?: EdgeType
}

export interface IGraphOptions {
  title?: string
  author?: string
  styles?: Object
  layout?: {
    nodesep?: number
    ranksep?: number
    freeze?: boolean
  }
}

export interface ParsedValues<N, E> {
  parsedNodes: N[]
  parsedEdges: E[]
  parsedOptions: IGraphOptions
}

enum EdgeType {
  Bezier = 'bezier',
  Taxi = 'taxi',
}

export enum NodeType {
  Default = 'defaultNode',
  CompoundParent = 'compoundNode',
  CompoundChild = 'compoundChild',
  Description = 'descriptionNode',
}

export type IGraphLibraryAdapter<N, E> = {
  transformNode: (node: INode) => N
  transformEdge: (edge: IEdge) => E
}
