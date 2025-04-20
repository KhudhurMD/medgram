import { $isListItemNode, $isListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createRangeSelection, $getNodeByKey, $isRootNode, $isTextNode, $setSelection, LexicalEditor } from 'lexical';
import { useEffect } from 'react';
import { appObserver, NODE_ADD_CHILD_COMMAND, NODE_ADD_SIBLING_COMMAND, NODE_CLICK_COMMAND } from '../../../../../../utils/appcommands';
import { $isStyledNode } from '../../common/stylednode';
import { $createListEntity, $createListItemEntity } from '../../misc/utils';
import { CustomListItemNode } from '../../nodes/CustomListItemNode';
import { getNearestListItem } from '../ReformTreeEscape';

export function GraphEventsPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    appObserver.subscribe(NODE_ADD_CHILD_COMMAND, ({ nodeId }) => {
      addChildNode(editor, nodeId);
      return true;
    });
    appObserver.subscribe(NODE_ADD_SIBLING_COMMAND, ({ nodeId }) => {
      addSiblingNode(editor, nodeId);
      return true;
    });
    appObserver.subscribe(NODE_CLICK_COMMAND, ({ nodeId }) => {
      selectNode(editor, nodeId);
      return true;
    });
  }, []);
  return null;
}

function addChildNode(editor: LexicalEditor, nodeId: string) {
  editor.update(() => {
    const node = $getNodeByKey(nodeId);
    if (!node) return;

    const listItemNode = getNearestListItem(node);
    if (!listItemNode) return;

    const nextListItemNode = listItemNode.getNextSibling();
    const isFirstChildList = $isListNode(nextListItemNode?.getChildren()[0]);

    if (nextListItemNode && isFirstChildList) {
      const newListItemNode = new CustomListItemNode();
      const newListNode = $createListEntity();
      const nextList = nextListItemNode.getChildren()[0];
      if (!nextList || !$isListNode(nextList)) return;

      newListItemNode.append(newListNode.append(nextListItemNode));
      listItemNode.insertAfter(newListItemNode);

      const newTextNode = newListNode.getChildren()[0]?.getChildren()[0].getChildren()[0];

      const newSelection = $createRangeSelection();
      newSelection.setTextNodeRange(newTextNode, 0, newTextNode, 0);
      $setSelection(newSelection);

      // nextListItemNode.replace(newListItemNode)
    } else {
      const newListItemNode = new CustomListItemNode();
      const newListNode = $createListEntity();
      newListItemNode.append(newListNode);
      const newTextNode = newListNode.getChildren()[0]?.getChildren()[0].getChildren()[0];
      listItemNode.insertAfter(newListItemNode);
      const newSelection = $createRangeSelection();
      newSelection.setTextNodeRange(newTextNode, 0, newTextNode, 0);
      $setSelection(newSelection);
    }
  });
}

function addSiblingNode(editor: LexicalEditor, nodeId: string) {
  editor.update(() => {
    const node = $getNodeByKey(nodeId);
    if (!node) return;

    const listItemNode = getNearestListItem(node);
    if (!listItemNode) return;

    const newListItemNode = $createListItemEntity();

    const isParentRoot = $isRootNode(listItemNode.getParents()[1]);
    if (isParentRoot) return;

    const nextListItemNode = listItemNode.getNextSibling();
    const nextListItemHasChildren = $isListNode(nextListItemNode?.getChildren()[0]);

    if (nextListItemNode && nextListItemHasChildren) {
      nextListItemNode.insertAfter(newListItemNode);
    } else {
      listItemNode.insertAfter(newListItemNode);
    }

    const newSelection = $createRangeSelection();
    const newTextNode = newListItemNode.getChildren()[0]?.getChildren()[0];
    newSelection.setTextNodeRange(newTextNode, 0, newTextNode, 0);
    $setSelection(newSelection);
  });
}

function selectNode(editor: LexicalEditor, nodeId: string) {
  editor.update(() => {
    const node = $getNodeByKey(nodeId);
    if (!node) return;

    if (!$isStyledNode(node)) return;

    const newSelection = $createRangeSelection();

    const lastTextNode = node.getChildren()[0];

    if (lastTextNode && $isTextNode(lastTextNode)) {
      const textLength = lastTextNode.getTextContent().length;
      newSelection.setTextNodeRange(lastTextNode, textLength, lastTextNode, textLength);
    } else {
      newSelection.anchor.set(node.__key, 0, 'element');
      newSelection.focus.set(node.__key, 0, 'element');
    }

    $setSelection(newSelection);

    // Remove styles then add them
    if (node.getStyles().includes('selected')) {
      editor.update(() => {
        node.removeStyles(['selected']);
      });
      setTimeout(() => {
        editor.update(() => {
          node.addStyles(['selected']);
        });
      }, 100);
    }
  });
}
