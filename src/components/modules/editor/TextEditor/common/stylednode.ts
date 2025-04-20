import { DOMExportOutput, EditorConfig, ElementNode, LexicalEditor, LexicalNode, RangeSelection, SerializedElementNode } from 'lexical'

import { ListNode, ListItemNode } from '@lexical/list'
import { $createListItemEntity } from '../misc/utils'
import { CompoundNodeBody } from '../plugins/CompoundNodePlugin/CompoundNodeBody'
import { CommentButton } from '../misc/CommentButton'
import { v4 } from 'uuid'
export class StyledNode extends ElementNode {
  __styles: string[]
  __node_id: string

  constructor(styles?: string[], key?: string, nodeId?: string) {
    super(key)
    this.__styles = styles || []
    this.__node_id = nodeId || v4().slice(0, 8)
  }

  setStyles(styles: string[]) {
    const self = this.getWritable()
    self.__styles = styles
  }

  addStyles(styles: string[]) {
    const self = this.getWritable()
    self.__styles = [...self.__styles, ...styles]
  }

  removeStyles(styles: string[]) {
    const self = this.getWritable()
    self.__styles = self.__styles.filter((style) => !styles.includes(style))
  }

  getStyles() {
    return this.getLatest().__styles
  }

  createDOM(config: EditorConfig, editor: LexicalEditor) {
    const dom = document.createElement('div')
    if (this.__styles) {
      dom.classList.value = this.__styles.join(' ')
    }
    return dom
  }

  static importJSON(json: SerializedStyledNode) {
    return new StyledNode(json.styles, json.nodeId)
  }

  exportJSON(): SerializedStyledNode {
    return {
      ...super.exportJSON(),
      styles: this.__styles,
      type: StyledNode.getType(),
      nodeId: this.__node_id,
    }
  }

  updateDOM(prevNode: StyledNode, dom: HTMLElement) {
    if (this.__styles !== prevNode.__styles) {
      dom.classList.value = this.__styles.join(' ')
    }
    return false
  }

  canIndent() {
    return false
  }

  static getType() {
    return 'stylednode'
  }

  static clone(node: StyledNode) {
    return new StyledNode(node.__styles, node.__key, node.__node_id)
  }
}
export interface SerializedStyledNode extends SerializedElementNode {
  type: string
  styles?: string[]
  nodeId?: string
}

export function $isStyledNode(node: LexicalNode | null | undefined): node is StyledNode {
  return node instanceof StyledNode
}
