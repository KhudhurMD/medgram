import { $isListItemNode, $isListNode, ListItemNode, SerializedListItemNode } from '@lexical/list'
import { $isTextNode, DOMChildConversion, DOMConversionFn, DOMConversionMap, EditorConfig, LexicalNode, NodeKey, TextNode } from 'lexical'
import { $createCollapsibleContainerNode } from '../plugins/CollapsiblePlugin/CollapsibleContainerNode'
import { $createCollapsibleContentNode } from '../plugins/CollapsiblePlugin/CollapsibleContentNode'
import { $createCollapsibleTitleNode } from '../plugins/CollapsiblePlugin/CollapsibleTitleNode'
import { CustomListNode } from './CustomListNode'
import { DefaultNode } from './defaultnode'

export class CustomListItemNode extends ListItemNode {
  __styles: string[]

  constructor(value?: number, checked?: boolean, styles?: string[], key?: NodeKey) {
    super(value, checked, key)
    this.__styles = styles || []
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

  getStyles(): string[] {
    return this.getLatest().__styles
  }

  static importDOM(): DOMConversionMap | null {
    return {
      li: (node) => {
        return {
          conversion: ConvertListItemNode,
          priority: 4,
        }
      },
      ul: (node) => {
        return null
      },
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config)
    if (this.__styles) {
      dom.classList.value = this.__styles.join(' ')
    }
    return dom
  }

  // append(...nodes: LexicalNode[]) {
  //   console.log(nodes)
  //   if (nodes.length < 2 && nodes[0]?.__children?.length < 2) return super.append(...nodes)
  //   const collapsibleContainer = $createCollapsibleContainerNode(true)
  //   const collapsibleTitle = $createCollapsibleTitleNode()
  //   const collapsibleContent = $createCollapsibleContentNode()
  //   nodes.forEach((node) => collapsibleContent.append(node))
  //   collapsibleContainer.append(collapsibleTitle, collapsibleContent)
  //   const prev = super.append(collapsibleContainer)
  //   return prev
  // }

  static importJSON(json: SerializedCustomListNode) {
    return new CustomListItemNode(json.value, json.checked, json.styles)
  }

  // @ts-ignore
  exportJSON(): SerializedCustomListNode {
    return {
      ...super.exportJSON(),
      styles: this.__styles,
      type: CustomListItemNode.getType(),
    }
  }

  static clone(node: CustomListItemNode) {
    return new CustomListItemNode(node.__value, node.__checked, node.__styles, node.__key)
  }

  static getType() {
    return 'custom-list-item'
  }
}

export interface SerializedCustomListNode extends Omit<SerializedListItemNode, 'type'> {
  styles?: string[]
  type: string
}

export function $isCustomListItemNode(node: LexicalNode): node is CustomListItemNode {
  return node instanceof CustomListItemNode
}

const ConvertListItemNode: DOMConversionFn = (el, _parent, _preformatted) => {
  return {
    node: null,
    preformatted: false,
    forChild: ConvertListItemNodeChild,
  }
}

const ConvertListItemNodeChild: DOMChildConversion = (node, parent) => {
  console.log(node)
  if ($isListItemNode(node)) {
    return new CustomListItemNode().append(new DefaultNode())
  } else if ($isTextNode(node)) {
    return new CustomListItemNode().append(new DefaultNode().append(new TextNode(node.getTextContent())))
  } else if ($isListNode(node)) {
    return new CustomListNode('bullet', 0)
  }
  return null
}
