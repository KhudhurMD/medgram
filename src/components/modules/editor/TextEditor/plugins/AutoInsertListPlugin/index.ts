import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot, $getTextContent, ParagraphNode, TextNode } from 'lexical'
import { ListNode, ListItemNode } from '@lexical/list'
import { StyledNode } from '../../common/stylednode'
import { $createListEntity } from '../../misc/utils'
import { useEffect } from 'react'

export function AutoInsertListAndStyledNodePlugin() {
  const [editor] = useLexicalComposerContext()

  // if a paragraph is inserted, convert it to a list entity
  useEffect(() => {
    editor.registerNodeTransform(ParagraphNode, (paragraphNode: ParagraphNode) => {
      const newListEntity = $createListEntity(paragraphNode)
      paragraphNode.replace(newListEntity)
      return newListEntity
    })
  }, [editor])

  // If empty, insert a list item entity
  // useEffect(() => {
  //   const textContent = editor.getEditorState().read(() => $getTextContent());
  //   console.log(textContent);
  //   if (textContent != undefined && textContent === "") {
  //     editor.update(() => {
  //       const root = $getRoot();
  //       const newListEntity = $createListItemEntity();
  //       root.append(newListEntity);
  //     });
  //   }
  // }, [editor]);

  return null
}
