import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TextNode } from 'lexical'
import { useEffect } from 'react'
import { $isStyledNode } from '../../common/stylednode'

export function RestructureFloatingTextPlugin() {
  const [editor] = useLexicalComposerContext()

  // useEffect(() => {
  //   editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
  //     const parent = textNode.getParent()
  //     console.log('must wrap in a parent', parent)
  //     const isParentStyled = $isStyledNode(parent)
  //     if (!isParentStyled) return
  //   })
  // }, [editor])
  return null
}
