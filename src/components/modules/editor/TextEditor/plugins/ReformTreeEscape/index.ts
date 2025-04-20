import { ListItemNode } from '@lexical/list';
import { indentList, outdentList } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isRootNode,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DELETE_CHARACTER_COMMAND,
  DELETE_LINE_COMMAND,
  KEY_BACKSPACE_COMMAND,
  LexicalNode,
} from 'lexical';
import { useEffect } from 'react';
import { $isStyledNode } from '../../common/stylednode';

export function ReformTreeEscape() {
  const [editor] = useLexicalComposerContext();
  editor.registerCommand(
    DELETE_CHARACTER_COMMAND,
    () => {
      const selection = $getSelection();
      if (!selection || !$isRangeSelection(selection)) return false;
      const currentNode = selection.anchor.getNode();
      if (!currentNode) return false;
      console.log('currentNode', currentNode);
      console.log('anchorNode', selection.anchor);
      if (selection.anchor.offset !== 0) return false;
      const parentList = getNearestListItem(currentNode);
      if (!parentList) return false;
      const isParentRoot = $isRootNode(parentList.getParents()[1]);

      if (!isParentRoot) return false;
      if ($getRoot().getFirstChild()?.getFirstChild() === parentList) return false;

      for (let i = 0; i < 10; i++) {
        outdentList();
      }
      for (let i = 0; i < 10; i++) {
        indentList();
      }
      return false;
    },
    COMMAND_PRIORITY_EDITOR
  );
  return null;
}

export function getNearestListItem(node: LexicalNode | null): ListItemNode | null {
  if (!node) return null;
  if (node instanceof ListItemNode) {
    return node;
  } else {
    return node.getParent() ? getNearestListItem(node.getParent()) : null;
  }
}
