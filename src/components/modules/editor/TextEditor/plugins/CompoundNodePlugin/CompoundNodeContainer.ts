import { ElementNode, LexicalNode } from 'lexical'
import { SerializedStyledNode, StyledNode } from '../../common/stylednode'
export class CompoundNodeContainer extends StyledNode {
  constructor(styles?: string[], nodeId?: string, key?: string) {
    if (styles) {
      const newStyles = styles?.includes('compound-node-container') ? styles : styles?.concat('compound-node-container')
      super(newStyles, key, nodeId)
    } else {
      super(['compound-node-container'], key, nodeId)
    }
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      styles: this.__styles,
      type: this.getType(),
      nodeId: this.__node_id,
    }
  }
  static getType() {
    return 'compound-node-container'
  }

  static clone(node: CompoundNodeContainer) {
    return new CompoundNodeContainer(node.__styles, node.__node_id, node.__key)
  }

  static importJSON(json: SerializedStyledNode) {
    return new CompoundNodeContainer(json.styles, json.nodeId)
  }

  setStyles(styles: string[]) {
    const newStyles = styles.includes('compound-node-container') ? styles : styles.concat('compound-node-container')
    super.setStyles(newStyles)
  }
}

export function $isCompoundNodeContainer(node: LexicalNode | ElementNode | null): node is CompoundNodeContainer {
  return node instanceof CompoundNodeContainer
}
