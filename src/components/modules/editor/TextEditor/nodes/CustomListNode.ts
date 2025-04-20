import { ListNode, ListType, SerializedListNode } from '@lexical/list'
import { DOMConversionFn, DOMConversionMap, LexicalNode, NodeKey, TextNode } from 'lexical'
import { $createCollapsibleContainerNode } from '../plugins/CollapsiblePlugin/CollapsibleContainerNode'
import { $createCollapsibleContentNode } from '../plugins/CollapsiblePlugin/CollapsibleContentNode'
import { $createCollapsibleTitleNode } from '../plugins/CollapsiblePlugin/CollapsibleTitleNode'
import { DefaultNode } from './defaultnode'

export class CustomListNode extends ListNode {
  constructor(listType: ListType, start: number, key?: NodeKey) {
    super(listType, start, key)
  }

  static getType() {
    return 'custom-list'
  }

  static importJSON(json: SerializedCustomListNode) {
    return new CustomListNode(json.listType, json.start)
  }

  static importDOM(): DOMConversionMap | null {
    return {
      ul: (node) => {
        return null
      },
      li: (node) => {
        return null
      },
    }
  }

  // @ts-ignore
  exportJSON(): SerializedCustomListNode {
    return {
      ...super.exportJSON(),
      type: CustomListNode.getType(),
    }
  }

  static clone(node: CustomListNode) {
    return new CustomListNode(node.__listType, node.__start, node.__key)
  }
}

interface SerializedCustomListNode extends Omit<SerializedListNode, 'type'> {
  type: string
}

export function $isCustomListNode(node: any): node is CustomListNode {
  return node instanceof CustomListNode
}

const ConvertListNode: DOMConversionFn = (el, parent, preformatted) => {
  console.log('convert list node')
  console.log(el, parent)
  return {
    node: new CustomListNode('bullet', 0).append(new DefaultNode()),
  }
}
