import { LexicalNode } from 'lexical'
import { SerializedStyledNode, StyledNode } from '../../common/stylednode'

export class DescriptionNodeBody extends StyledNode {
  constructor(styles?: string[], key?: string) {
    const newStyles = styles?.includes('description-node-body') ? styles : styles?.concat('description-node-body')
    super(newStyles, key)
  }
  setStyles(styles: string[]) {
    const newStyles = styles.includes('description-node-body') ? styles : styles.concat('description-node-body')
    super.setStyles(newStyles)
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      styles: this.__styles,
      type: this.getType(),
    }
  }

  static importJSON(json: SerializedStyledNode) {
    return new DescriptionNodeBody(json.styles)
  }
  static getType() {
    return 'description-node-body'
  }
  static clone(node: DescriptionNodeBody) {
    return new DescriptionNodeBody(node.__styles, node.__key)
  }
}

export function $isDescriptionNodeBody(node: LexicalNode | null | undefined): node is DescriptionNodeBody {
  return node instanceof DescriptionNodeBody
}
