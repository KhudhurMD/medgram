import { ListItemNode } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, DELETE_CHARACTER_COMMAND, LexicalNode, OUTDENT_CONTENT_COMMAND } from 'lexical'
import { $isCompoundNodeBody } from '../CompoundNodePlugin/CompoundNodeBody'
import { $isDescriptionNodeBody } from '../DescriptionNodePlugin/DescriptionNodeBody'
import { $isDescriptionNodeContainer } from '../DescriptionNodePlugin/DescriptionNodeContainer'
import { getNearestStyledNode } from '../ToolbarPlugin'

export function DeleteCharacterOutdentPlugin() {
  const [editor] = useLexicalComposerContext()
  editor.registerCommand(
    DELETE_CHARACTER_COMMAND,
    () => {
      const selection = $getSelection()
      if (
        !selection ||
        !$isRangeSelection(selection) ||
        selection.anchor.offset !== selection.focus.offset ||
        selection.anchor.getNode() !== selection.focus.getNode()
      ) {
        return false
      }
      const anchor = selection.anchor.offset
      const selectedNode = selection.anchor.getNode()
      const parent = getNearestStyledNode(selectedNode)
      if (!parent) return false

      if ($isDescriptionNodeBody(parent) || $isCompoundNodeBody(parent)) {
        return false
      }

      if (anchor == 0 && selectedNode.getParents().length > 4) {
        editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
        return true
      } else if (anchor == 0 && selectedNode.getParents().length <= 4) {
        return false
      }
      return false
    },
    COMMAND_PRIORITY_EDITOR
  )

  return null
}

function getNearestListItem(node: LexicalNode | null): ListItemNode | null {
  if (!node) return null
  if (node instanceof ListItemNode) {
    return node
  } else {
    return node.getParent() ? getNearestListItem(node.getParent()) : null
  }
}
