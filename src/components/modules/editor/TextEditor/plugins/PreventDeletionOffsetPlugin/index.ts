import { indentList, outdentList } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestNodeOfType } from "@lexical/utils";
import {
  $createRangeSelection,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  COMMAND_PRIORITY_HIGH,
  DELETE_CHARACTER_COMMAND,
} from "lexical";
import { useEffect } from "react";
import { $isStyledNode } from "../../common/stylednode";
import { getNearestListItem } from "../../misc/utils";
import { $isCustomListItemNode } from "../../nodes/CustomListItemNode";
import { CustomListNode } from "../../nodes/CustomListNode";
import { $isCompoundNodeTitle } from "../CompoundNodePlugin/CompoundNodeTitle";
import { $isDescriptionNodeTitle } from "../DescriptionNodePlugin/DescriptionNodeTitle";

export function PreventDeletionOffsetPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    // Check if two custom list nodes are selected
    editor.registerCommand(
      DELETE_CHARACTER_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;
        const selectedNodes = selection.getNodes();
        if (selectedNodes.length == 1) return false;

        const includesTwoCustomListNodes = selectedNodes.filter((node) => $isCustomListItemNode(node)).length == 2;

        const includesTwoStyledNodes =
          selectedNodes.filter((node) => $isStyledNode(node) || $isCompoundNodeTitle(node) || $isDescriptionNodeTitle(node)).length == 2;

        // console.log(selectedNodes);

        if (!includesTwoCustomListNodes && !includesTwoStyledNodes) return false;

        const anchorNode = selection.anchor.getNode();
        const anchorNodeOffset = selection.anchor.offset;
        const focusNode = selection.focus.getNode();
        const focusNodeOffset = selection.focus.offset;

        // console.log("anchor ", anchorNode);
        // console.log("anchor offset ", anchorNodeOffset);
        // console.log("focus ", focusNode);
        // console.log("focus offset ", focusNodeOffset);

        if (focusNodeOffset != 0 || anchorNodeOffset != 0) return false;

        if (!$isTextNode(anchorNode) && !$isStyledNode(anchorNode)) return false;

        // Remove list item
        // const listItem = getNearestListItem(anchorNode);
        // listItem?.remove();

        if ($isTextNode(anchorNode)) anchorNode.setTextContent("");

        const newSelection = $createRangeSelection();

        if ($isTextNode(anchorNode)) {
          newSelection.setTextNodeRange(anchorNode, 0, anchorNode, 0);
        }

        if ($isStyledNode(anchorNode)) {
          // console.log("selection anchor node");
          newSelection.anchor.set(anchorNode.getKey(), 0, "element");
          newSelection.focus.set(anchorNode.getKey(), 0, "element");
        }

        $setSelection(newSelection);

        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
  });
  return null;
}
