import { LexicalNode } from 'lexical'
import { SerializedStyledNode, StyledNode } from '../../common/stylednode'

export class CompoundNodeBody extends StyledNode {
  constructor(styles?: string[], key?: string) {
    const newStyles = styles?.includes('compound-node-body')
      ? styles
      : styles?.concat('compound-node-body')
    super(newStyles, key)
  }
  setStyles(styles: string[]) {
    const newStyles = styles.includes('compound-node-body')
      ? styles
      : styles.concat('compound-node-body')
    super.setStyles(newStyles)
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      styles: this.__styles,
      type: this.getType(),
    }
  }

  insertNewAfter() {
    const newCompoundNodeBody = new CompoundNodeBody()
    this.insertAfter(newCompoundNodeBody)
    return newCompoundNodeBody
  }
  static importJSON(json: SerializedStyledNode) {
    return new CompoundNodeBody(json.styles)
  }
  static getType() {
    return 'compound-node-body'
  }
  static clone(node: CompoundNodeBody) {
    return new CompoundNodeBody(node.__styles, node.__key)
  }
}

export function $isCompoundNodeBody(
  node: LexicalNode | null | undefined
): node is CompoundNodeBody {
  return node instanceof CompoundNodeBody
}
