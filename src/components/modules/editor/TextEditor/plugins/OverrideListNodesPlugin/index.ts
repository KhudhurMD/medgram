import { ListItemNode } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { $isCustomListItemNode, CustomListItemNode } from '../../nodes/CustomListItemNode'
import { $isCustomListNode } from '../../nodes/CustomListNode'

export function OverrideListNodesPlugin() {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    editor.registerNodeTransform(ListItemNode, (listItemNode: ListItemNode) => {
      const newListItemNode = new CustomListItemNode(listItemNode.__value, listItemNode.__checked)
      listItemNode.getChildren().forEach((child) => {
        newListItemNode.append(child)
      })
      listItemNode.replace(newListItemNode)
    })
    editor.registerNodeTransform(CustomListItemNode, (customListItemNode: CustomListItemNode) => {
      const child = customListItemNode.getChildren()[0]
      if (child && $isCustomListNode(child)) {
        const styles = customListItemNode.getStyles()
        if (styles && styles.includes('hide-mark')) return
        const newCustomListItemNode = new CustomListItemNode(customListItemNode.__value, customListItemNode.__checked)
        newCustomListItemNode.setStyles(['hide-mark'])
        customListItemNode.getChildren().forEach((child) => {
          newCustomListItemNode.append(child)
        })
        customListItemNode.replace(newCustomListItemNode)
        const adjacentNode = newCustomListItemNode.getPreviousSibling()
        // if (adjacentNode && $isCustomListItemNode(adjacentNode)) {
        //   console.log('Hiding marks in adjacent node')
        //   if (adjacentNode.getStyles().includes('before-hide-mark')) return
        //   const newAdjacentNode = new CustomListItemNode(adjacentNode.__value, adjacentNode.__checked)
        //   newAdjacentNode.addStyles(['before-hide-mark'])
        //   adjacentNode.getChildren().forEach((child) => {
        //     newAdjacentNode.append(child)
        //   })
        //   adjacentNode.replace(newAdjacentNode)
        // }
      }
    })
  }, [editor])

  return null
}
