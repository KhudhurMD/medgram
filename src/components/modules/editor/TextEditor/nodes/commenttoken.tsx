import { $createRangeSelection, $setSelection, DecoratorNode, EditorConfig, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical'
import { ReactNode } from 'react'
import { CommentButton } from '../misc/CommentButton'

export class CommentToken extends DecoratorNode<ReactNode> {
  __id: string
  __deletable: boolean

  constructor(id: string, key?: NodeKey) {
    super(key)
    this.__id = id
    this.__deletable = false
  }

  // setDeletable(deletable: boolean) {
  //   const writeable = this.getWritable()
  //   writeable.__deletable = deletable
  // }
  //
  // getDeletable() {
  //   const latest = this.getLatest()
  //   return latest.__deletable
  // }

  static getType(): string {
    return 'comment-node'
  }

  static clone(node: CommentToken): CommentToken {
    return new CommentToken(node.__id, node.__key)
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div')
    div.style.display = 'inline'
    div.style.margin = '0px'
    div.style.marginBottom = '-5px'
    div.style.padding = '0px'
    div.style.border = '0px'
    return div
  }

  isInline(): boolean {
    return true
  }

  getDeleteable(): boolean {
    return this.getLatest().__deletable
  }

  setDeleteable(deletable: boolean) {
    const writeable = this.getWritable()
    writeable.__deletable = deletable
  }

  updateDOM(): false {
    return false
  }

  decorate(): ReactNode {
    return <CommentButton id={this.__id} nodeKey={this.__key} />
  }

  exportJSON(): SerializedCommentNode {
    return {
      id: this.__id,
      type: this.getType(),
      version: 1,
    }
  }

  remove(preserveEmptyParent?: boolean | undefined): void {
    if (this.getDeleteable()) {
      super.remove(preserveEmptyParent)
    }
    // move cursor to the left of the comment
    const anchorNode = this
    const previousNode = anchorNode.getPreviousSibling()
    if (!previousNode) return
    const previousNodeId = previousNode.getKey()
    console.log(anchorNode, previousNode)

    const newSelection = $createRangeSelection()
    newSelection.anchor.set(previousNodeId, previousNode.getTextContent().length, 'text')
    newSelection.focus.set(previousNodeId, previousNode.getTextContent().length, 'text')
    console.log(newSelection)

    $setSelection(newSelection)
  }

  static importJSON(json: SerializedCommentNode) {
    return new CommentToken(json.id)
  }
}

interface SerializedCommentNode extends SerializedLexicalNode {
  type: string
  id: string
}

export function $createCommentNode(id: string): CommentToken {
  return new CommentToken(id)
}

export function $isCommentNode(node: LexicalNode | null | undefined): node is CommentToken {
  return node instanceof CommentToken
}
