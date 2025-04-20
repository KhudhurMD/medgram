import { ListItemNode, ListNode } from '@lexical/list'
import { LexicalNode, TextNode } from 'lexical'
import { CustomListItemNode } from '../nodes/CustomListItemNode'
import { CustomListNode } from '../nodes/CustomListNode'
import { DefaultNode } from '../nodes/defaultnode'

export function $createListEntity(node?: LexicalNode): CustomListNode {
  const newListNode = new CustomListNode('bullet', 0)
  const newListItemNode = new CustomListItemNode()
  const newDefaultNode = new DefaultNode()
  const newTextNode = new TextNode(node?.getTextContent() || '')
  return newListNode.append(newListItemNode.append(newDefaultNode.append(newTextNode)))
}

export function $createListItemEntity(node?: LexicalNode): CustomListItemNode {
  const newListItemNode = new CustomListItemNode()
  const newDefaultNode = new DefaultNode()
  const newTextNode = new TextNode(node?.getTextContent() || '')
  return newListItemNode.append(newDefaultNode.append(newTextNode))
}
