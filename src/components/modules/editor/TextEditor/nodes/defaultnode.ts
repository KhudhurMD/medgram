import { SerializedStyledNode, StyledNode } from '../common/stylednode'
import { $createRangeSelection, $getSelection, $setSelection, LexicalNode, NodeKey, RangeSelection, TextNode } from 'lexical'
import { ListItemNode, $isListNode, $isListItemNode } from '@lexical/list'
import { $createListItemEntity } from '../misc/utils'
import { CustomListItemNode } from './CustomListItemNode'

export class DefaultNode extends StyledNode {
  constructor(styles?: string[], nodeId?: string, key?: NodeKey) {
    super(styles, key, nodeId)
  }

  static importJSON(json: SerializedStyledNode) {
    return new DefaultNode(json.styles, json.nodeId)
  }

  insertNewAfter(selection: RangeSelection) {
    const anchor = selection.anchor.getNode()
    const anchorOffset = selection.anchor.offset
    const emptyNode = new TextNode('')
    const parent = this.getParent()
    const isFirstNode = this === parent?.getFirstChild()
    const textLength = anchor.getTextContent().length
    const leftText = this.getTextContent().slice(0, anchorOffset)
    const rightText = this.getTextContent().slice(anchorOffset)

    if (parent && $isListItemNode(parent)) {
      if (anchorOffset == textLength && isFirstNode) {
        const newListItemEntity = $createListItemEntity()
        parent.insertAfter(newListItemEntity)
        return newListItemEntity
      }
      const newCurrentNode = new DefaultNode(this.getStyles()).append(new TextNode(leftText))
      this.replace(newCurrentNode)

      const newTextNode = new TextNode(rightText)
      const newListItemEntity = new CustomListItemNode().append(new DefaultNode().append(newTextNode))
      parent.insertAfter(newListItemEntity)

      const newSelection = $createRangeSelection()
      newSelection.setTextNodeRange(newTextNode, 0, newTextNode, 0)
      $setSelection(newSelection)

      return emptyNode
    }
    return emptyNode
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
    return 'defaultnode'
  }

  static clone(node: DefaultNode) {
    return new DefaultNode(node.__styles, node.__node_id, node.__key)
  }
}

export function $isDefaultNode(node: LexicalNode | null | undefined): node is DefaultNode {
  return node instanceof DefaultNode
}
