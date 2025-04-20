import { $isListItemNode } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $createRangeSelection,
  $getSelection,
  $isLineBreakNode,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  INSERT_PARAGRAPH_COMMAND,
  LexicalCommand,
  LexicalNode,
  TextNode,
} from 'lexical'
import { $isStyledNode } from '../../common/stylednode'
import { $createListItemEntity } from '../../misc/utils'
import { getNearestListItem } from '../ReformTreeEscape'
import { $isDescriptionNodeBody, DescriptionNodeBody } from './DescriptionNodeBody'
import { $isDescriptionNodeContainer, DescriptionNodeContainer } from './DescriptionNodeContainer'
import { DescriptionNodeTitle } from './DescriptionNodeTitle'

export function DescriptionNodePlugin() {
  const [editor] = useLexicalComposerContext()
  const CONVERT_STYLED_NODE_TO_DESCRIPTION: LexicalCommand<undefined> = createCommand()

  editor.registerCommand(
    CONVERT_STYLED_NODE_TO_DESCRIPTION,
    () => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) {
        return false
      }

      const selectedNode = selection.anchor.getNode()
      const selectedNodeParent = selectedNode.getParent()
      if (selectedNode && selectedNodeParent && $isTextNode(selectedNode) && $isStyledNode(selectedNodeParent)) {
        const newDescriptionNodeContainer = new DescriptionNodeContainer()
        const newDescriptionNodeTitle = new DescriptionNodeTitle()
        const newTextNode = new TextNode('Title')

        const grandparent = selectedNodeParent.getParent()
        const nextSibling = grandparent?.getNextSibling()

        if (grandparent && $isListItemNode(grandparent) && (!nextSibling || $isListItemNode(nextSibling))) {
          const newListItemEntity = $createListItemEntity()
          grandparent.insertAfter(newListItemEntity)
        }

        selectedNodeParent.replace(newDescriptionNodeContainer.append(newDescriptionNodeTitle.append(newTextNode)))
        const anchorOffset = 0
        const newSelection = $createRangeSelection()

        newSelection.setTextNodeRange(newTextNode, anchorOffset, newTextNode, anchorOffset)
        $setSelection(newSelection)
        return true
      }
      return false
    },
    COMMAND_PRIORITY_EDITOR
  )

  editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
    if (textNode.getTextContent().includes('==')) {
      editor.dispatchCommand(CONVERT_STYLED_NODE_TO_DESCRIPTION, undefined)
    }
  })

  editor.registerCommand(
    INSERT_PARAGRAPH_COMMAND,
    () => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) {
        return false
      }
      const selectedNode = selection.anchor.getNode()
      if (!selectedNode || !$isDescriptionNodeBody(selectedNode)) return false
      const parent = selectedNode.getParent()
      if (!parent || !$isDescriptionNodeContainer(parent)) return false
      // Skip if two line breaks are already present
      // Delete trailing empty nodes
      let nonEmptyNodeEncountered = false
      let numberOfEmptyNodes = 0
      let shouldDeleteTrailingEmptyNodes = false
      const noTrailingEmptyNodes = selectedNode
        .getChildren()
        .reverse()
        .filter((node: LexicalNode) => {
          if ($isLineBreakNode(node) && !nonEmptyNodeEncountered) {
            numberOfEmptyNodes++
            if (numberOfEmptyNodes > 1) shouldDeleteTrailingEmptyNodes = true
            return false
          }
          if (!$isLineBreakNode(node)) {
            nonEmptyNodeEncountered = true
            numberOfEmptyNodes = 0
          }
          return true
        })
        .reverse()
      if (!shouldDeleteTrailingEmptyNodes) return false

      const newBodyWithoutTrailingEmptyNodes = new DescriptionNodeBody()
      newBodyWithoutTrailingEmptyNodes.setStyles(selectedNode.getStyles())
      noTrailingEmptyNodes.forEach((node: LexicalNode) => newBodyWithoutTrailingEmptyNodes.append(node))
      selectedNode.replace(newBodyWithoutTrailingEmptyNodes)

      // If sibling list node exists change selection to it
      const grandparent = getNearestListItem(parent)
      const nextSibling = grandparent?.getNextSibling()
      if (grandparent && $isListItemNode(grandparent) && nextSibling && $isListItemNode(nextSibling)) {
        const newSelection = $createRangeSelection()
        newSelection.anchor.set(nextSibling.getKey(), 0, 'element')
        newSelection.focus.set(nextSibling.getKey(), 0, 'element')
        $setSelection(newSelection)
        return true
      } else {
        const newListItemEntity = $createListItemEntity()
        grandparent?.insertAfter(newListItemEntity)
        const newSelection = $createRangeSelection()
        newSelection.anchor.set(newListItemEntity.getKey(), 0, 'element')
        newSelection.focus.set(newListItemEntity.getKey(), 0, 'element')
        $setSelection(newSelection)
        return true
      }
      return false
    },
    COMMAND_PRIORITY_EDITOR
  )
  return null
}
