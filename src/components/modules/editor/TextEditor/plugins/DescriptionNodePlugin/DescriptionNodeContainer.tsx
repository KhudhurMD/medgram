import { ElementNode, LexicalNode } from 'lexical'
import { SerializedStyledNode, StyledNode } from '../../common/stylednode'
export class DescriptionNodeContainer extends StyledNode {
  constructor(styles?: string[], nodeId?: string, key?: string) {
    if (styles) {
      const newStyles = styles?.includes('description-node-container') ? styles : styles?.concat('description-node-container')
      super(newStyles, key, nodeId)
    } else {
      super(['description-node-container'], key, nodeId)
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
    return 'description-node-container'
  }

  static clone(node: DescriptionNodeContainer) {
    return new DescriptionNodeContainer(node.__styles, node.__node_id, node.__key)
  }

  static importJSON(json: SerializedStyledNode) {
    return new DescriptionNodeContainer(json.styles, json.nodeId)
  }

  setStyles(styles: string[]) {
    const newStyles = styles.includes('description-node-container') ? styles : styles.concat('description-node-container')
    super.setStyles(newStyles)
  }
}

export function $isDescriptionNodeContainer(node: LexicalNode | ElementNode | null): node is DescriptionNodeContainer {
  return node instanceof DescriptionNodeContainer
}
