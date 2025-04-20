import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, COMMAND_PRIORITY_HIGH, INDENT_CONTENT_COMMAND } from 'lexical'
import { useEffect } from 'react'
import { getNearestListItem } from '../ReformTreeEscape'

export function MaxIndentPlugin() {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    editor.registerCommand(
      INDENT_CONTENT_COMMAND,
      () => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return false

        const anchorNode = selection.anchor.getNode()
        const nearestListItem = getNearestListItem(anchorNode)
        const previousSibling = nearestListItem?.getPreviousSibling()

        if (!previousSibling) {
          console.log('Max level reached')
          return true
        }

        return false
      },
      COMMAND_PRIORITY_HIGH
    )
  }, [editor])
  return null
}
