import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { INDENT_CONTENT_COMMAND, TextNode } from 'lexical'
import { useEffect } from 'react'

export function SpaceIndentPlugin() {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
      if (textNode.getTextContent() == ' ') {
        const newEmptyTextNode = new TextNode('')
        textNode.replace(newEmptyTextNode)
        editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
      }
    })
  }, [editor])
  return null
}
