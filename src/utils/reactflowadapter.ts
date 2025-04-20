import { IEdge, IGraphLibraryAdapter, INode } from '../types/parser'
import { ReactFlowEdge, ReactFlowNode } from '../types/ReactFlow'

export function ReactFlowAdapter(): IGraphLibraryAdapter<ReactFlowNode, ReactFlowEdge> {
  return {
    transformNode: (node: INode) => {
      const { id, label, sublabel, classes, position, type, compoundChildren, body, bodyClasses } = node
      return {
        id: id,
        data: {
          label: label,
          sublabel: sublabel,
          classes: classes?.split('.').join(' '),
          children: compoundChildren?.map((child) => ReactFlowAdapter().transformNode(child)),
          body: body,
          bodyClasses,
        },
        position: { x: 0, y: 0 },
        type: type,
      }
    },
    transformEdge: (edge: IEdge) => {
      const { id, label, source, target, type } = edge
      return {
        id: id,
        source: source,
        target: target,
        type: type,
        label: label,
      }
    },
  }
}
