import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createRangeSelection, $getNodeByKey, $getRoot, $isElementNode, $isRootNode, $setSelection, LexicalNode, TextNode } from 'lexical'
import { useEffect } from 'react'
import { $isStyledNode } from '../../common/stylednode'
import { useAppSelector } from '../../../../../../store/storeHooks'

export function HighlightLinePlugin() {
  const selectedNode = useAppSelector((state) => state.texteditor.selectedNode)
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    if (selectedNode) {
      return editor.update(() => {
        // const node = $getNodeByKey(selectedNode);
        // if ($isStyledNode(node)) {
        //   node.addStyles(["selected"]);
        //   const textNode = node.getLastChild() as TextNode;
        //   const newSelection = $createRangeSelection();
        //   newSelection.setTextNodeRange(textNode, textNode.__text.length, textNode, textNode.__text.length);
        //   $setSelection(newSelection);
        // }
        traverseAndSelectHighlightedNodes($getRoot(), selectedNode)
      })
    } else {
      return editor.update(() => {
        traverseAndDeselectNodes($getRoot())
      })
    }
  }, [editor, selectedNode])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState, prevEditorState }) => {})
  }, [editor])
  return null
}

function traverseAndDeselectNodes(currentNode: LexicalNode) {
  if (($isElementNode(currentNode) || $isRootNode(currentNode)) && currentNode.getChildren() && !$isStyledNode(currentNode)) {
    currentNode.getChildren().forEach((child) => {
      traverseAndDeselectNodes(child)
    })
  } else if ($isStyledNode(currentNode)) {
    currentNode.removeStyles(['selected'])
  }
}

function traverseAndSelectHighlightedNodes(currentNode: LexicalNode, id: string) {
  if (($isElementNode(currentNode) || $isRootNode(currentNode)) && currentNode.getChildren() && !$isStyledNode(currentNode)) {
    currentNode.getChildren().forEach((child) => {
      traverseAndSelectHighlightedNodes(child, id)
    })
  } else if ($isStyledNode(currentNode)) {
    if (currentNode.__key == id) {
      currentNode.addStyles(['selected'])
    }
  }
}
