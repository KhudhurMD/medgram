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
  DELETE_CHARACTER_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  LexicalCommand,
  LexicalNode,
  TextNode,
} from 'lexical'
import { $isListItemNode } from '@lexical/list'
import { $isCompoundNodeContainer, CompoundNodeContainer } from './CompoundNodeContainer'
import { CompoundNodeTitle } from './CompoundNodeTitle'
import { $isDefaultNode } from '../../nodes/defaultnode'
import { $createListItemEntity } from '../../misc/utils'
import { $isCompoundNodeBody, CompoundNodeBody } from './CompoundNodeBody'

export function CompoundNodePlugin() {
  const [editor] = useLexicalComposerContext()
  const CONVERT_STYLED_NODE_TO_COMPOUND: LexicalCommand<undefined> = createCommand()

  editor.registerCommand(
    CONVERT_STYLED_NODE_TO_COMPOUND,
    () => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) {
        return false
      }

      const selectedNode = selection.anchor.getNode()
      const selectedNodeParent = selectedNode.getParent()

      if (selectedNode && selectedNodeParent && $isTextNode(selectedNode) && $isDefaultNode(selectedNodeParent)) {
        // Perform transformation here
        const newCompoundNodeContainer = new CompoundNodeContainer()
        const newCompoundNodeTitle = new CompoundNodeTitle()
        const newTextNode = new TextNode('')

        const grandparent = selectedNodeParent.getParent()
        const nextSibling = grandparent?.getNextSibling()
        if (grandparent && $isListItemNode(grandparent) && (!nextSibling || $isListItemNode(nextSibling))) {
          const newListItemEntity = $createListItemEntity()
          grandparent.insertAfter(newListItemEntity)
        }

        selectedNodeParent.replace(newCompoundNodeContainer.append(newCompoundNodeTitle.append(newTextNode)))
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
    if (textNode.getTextContent().includes('>>')) {
      editor.dispatchCommand(CONVERT_STYLED_NODE_TO_COMPOUND, undefined)
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
      if (selectedNode && $isCompoundNodeBody(selectedNode) && selectedNode.isEmpty()) {
        const parent = selectedNode.getParent()
        if (parent && $isCompoundNodeContainer(parent)) {
          // Delete trailing empty nodes
          let nonEmptyNodeEncountered = false
          const noTrailingEmptyNodes = parent
            .getChildren()
            .reverse()
            .filter((node: LexicalNode) => {
              if (node.isEmpty() && !nonEmptyNodeEncountered) {
                return false
              }
              if (!node.isEmpty()) {
                nonEmptyNodeEncountered = true
              }
              return true
            })
            .reverse()
          const parentWithoutTrailingEmptyNodes = new CompoundNodeContainer()
          parentWithoutTrailingEmptyNodes.setStyles(parent.getStyles())
          noTrailingEmptyNodes.forEach((node: LexicalNode) => parentWithoutTrailingEmptyNodes.append(node))
          parent.replace(parentWithoutTrailingEmptyNodes)

          // If sibling list node exists change selection to it
          const grandparent = parentWithoutTrailingEmptyNodes.getParent()
          const nextSibling = grandparent?.getNextSibling()
          if (grandparent && $isListItemNode(grandparent) && nextSibling && $isListItemNode(nextSibling)) {
            const newSelection = $createRangeSelection()
            newSelection.anchor.set(nextSibling.getKey(), 0, 'element')
            newSelection.focus.set(nextSibling.getKey(), 0, 'element')
            $setSelection(newSelection)
            return true
          } else {
            // create new list item
            const newListItemEntity = $createListItemEntity()
            grandparent?.insertAfter(newListItemEntity)
            const newSelection = $createRangeSelection()
            newSelection.anchor.set(newListItemEntity.getKey(), 0, 'element')
            newSelection.focus.set(newListItemEntity.getKey(), 0, 'element')
            $setSelection(newSelection)
            return true
          }
        }
      }
      return false
    },
    COMMAND_PRIORITY_EDITOR
  )
  // editor.registerCommand(
  //   DELETE_CHARACTER_COMMAND,
  //   () => {
  //     console.log("haha");
  //     const selection = $getSelection();
  //     if (!$isRangeSelection(selection)) {
  //       return false;
  //     }
  //     const anchorOffset = selection.anchor.offset;
  //     const selectedNode = selection.anchor.getNode();
  //     const selectedNodeParent = selectedNode.getParent();
  //     console.log(selectedNode, selectedNodeParent, anchorOffset);
  //     if (
  //       anchorOffset == 0 &&
  //       selectedNode &&
  //       selectedNode.isEmpty() &&
  //       selectedNodeParent &&
  //       $isCompoundNodeBody(selectedNode) &&
  //       $isCompoundNodeContainer(selectedNodeParent)
  //     ) {
  //       console.log("delete this node");
  //     }
  //     return false;
  //   },
  //   COMMAND_PRIORITY_EDITOR
  // );

  return null
}
