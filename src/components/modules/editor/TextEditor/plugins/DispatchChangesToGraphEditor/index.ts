import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isElementNode, $isRootNode, COMMAND_PRIORITY_EDITOR, FOCUS_COMMAND, INSERT_PARAGRAPH_COMMAND, LexicalNode } from 'lexical';
import { useEffect, useState } from 'react';

import { graphSlice } from '../../../Graph/slice';
import { $isStyledNode, StyledNode } from '../../common/stylednode';
import { $isDefaultNode, DefaultNode } from '../../nodes/defaultnode';
import { textEditorSlice } from '../../slice';
import { $isClassesToken } from '../ColoredTokensPlugin/ClassesToken';
import { $isEdgelabelToken } from '../ColoredTokensPlugin/EdgeLabelToken';
import { $isSublabelToken } from '../ColoredTokensPlugin/SubLabelToken';
import { $isCompoundNodeBody, CompoundNodeBody } from '../CompoundNodePlugin/CompoundNodeBody';
import { $isCompoundNodeContainer, CompoundNodeContainer } from '../CompoundNodePlugin/CompoundNodeContainer';
import { $isCompoundNodeTitle, CompoundNodeTitle } from '../CompoundNodePlugin/CompoundNodeTitle';
import { useAppDispatch, useAppSelector } from '../../../../../../store/storeHooks';
import { IEdge, INode, NodeType } from '../../../../../../types/parser';
import { $isDescriptionNodeContainer, DescriptionNodeContainer } from '../DescriptionNodePlugin/DescriptionNodeContainer';
import { $isDescriptionNodeTitle, DescriptionNodeTitle } from '../DescriptionNodePlugin/DescriptionNodeTitle';
import { DescriptionNodeBody } from '../DescriptionNodePlugin/DescriptionNodeBody';
import { syncSlice } from '../../../Sync/slice';

export function DispatchChangesToGraphEditor() {
  const [editor] = useLexicalComposerContext();
  const [shouldDispatchChanges, setShouldDispatchChanges] = useState(false);
  const dispatch = useAppDispatch();
  const isGraphFrozen = useAppSelector((state) => state.graph.options.layout?.freeze);

  useEffect(() => {
    if (shouldDispatchChanges) {
      return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves, prevEditorState }) => {
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
          return;
        }
        editorState.read(() => {
          dispatch(textEditorSlice.actions.editorStateUpdated(JSON.stringify(editorState.toJSON())));
          const root = $getRoot();
          const nodes = $traverseAndParseNodes(root);
          const edges = $traverseAndParseEdges(root, [[root, 0]]);
          if (nodes && edges) {
            dispatch(
              textEditorSlice.actions.userChangedInput({
                parsedNodes: nodes,
                parsedEdges: edges,
                userOptions: {
                  layout: {},
                },
              })
            );
          }

          const prevEdges = prevEditorState.read(() => {
            const root = $getRoot();
            return $traverseAndParseEdges(root, [[root, 0]]);
          });

          if (JSON.stringify(edges) !== JSON.stringify(prevEdges)) {
            if (isGraphFrozen !== true) {
              dispatch(graphSlice.actions.layoutingTriggered());
            }
          }
        });
      });
    }
    editor.registerCommand(
      INSERT_PARAGRAPH_COMMAND,
      () => {
        if (isGraphFrozen === true) return false;
        setTimeout(() => {
          dispatch(graphSlice.actions.layoutingTriggered());
        }, 50);
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor, shouldDispatchChanges, isGraphFrozen]);

  editor.registerCommand(
    FOCUS_COMMAND,
    () => {
      setShouldDispatchChanges(true);
      dispatch(syncSlice.actions.resumeSync());
      return false;
    },
    COMMAND_PRIORITY_EDITOR
  );
  return null;
}

const $traverseAndParseNodes = (currentNode: LexicalNode): INode[] => {
  const nodes: INode[] = [];
  if (($isElementNode(currentNode) || $isRootNode(currentNode)) && currentNode.getChildren() && !$isStyledNode(currentNode)) {
    currentNode.getChildren().forEach((child) => {
      nodes.push(...$traverseAndParseNodes(child));
    });
  } else if ($isStyledNode(currentNode)) {
    const node = parseNodes(currentNode);
    if (node) {
      return [node];
    }
  }
  return nodes;
};

const $traverseAndParseEdges = (currentNode: LexicalNode, nodesLevelsArr: [LexicalNode, number][]): IEdge[] => {
  const edges: IEdge[] = [];
  if (($isElementNode(currentNode) || $isRootNode(currentNode)) && currentNode.getChildren() && !$isStyledNode(currentNode)) {
    currentNode.getChildren().forEach((child) => {
      edges.push(...$traverseAndParseEdges(child, nodesLevelsArr));
    });
  } else if ($isStyledNode(currentNode)) {
    const edge = parseEdges(currentNode, nodesLevelsArr);
    if (edge) {
      return [edge];
    }
  }
  return edges;
};

function parseEdges(currentNode: StyledNode, nodesLevelsArr: [LexicalNode, number][]): IEdge {
  const currentLevel = currentNode.getParents().length;
  const parent = nodesLevelsArr
    .filter(([_node, level]) => currentLevel > level)
    .reduce((prev, current) => {
      return prev[1] > current[1] ? prev : current;
    })[0];
  const edgelabel = getEdgelabel(currentNode);
  const edge = createEdgeFromIds(currentNode.__key, parent.__key, false, edgelabel);
  const isDuplicatePresent = nodesLevelsArr.filter(([_node, level]) => level === currentLevel);
  if (!isDuplicatePresent) {
    nodesLevelsArr.push([currentNode, currentLevel]);
  }
  nodesLevelsArr.push([currentNode, currentLevel]);
  return edge;
}

function parseNodes(currentNode: StyledNode) {
  if ($isDefaultNode(currentNode)) {
    const nodelabel = getNodelabel(currentNode);
    const sublabel = getSublabel(currentNode);
    const userSpecifiedClasses = getUserSpecifiedClasses(currentNode) || [];
    const classes = currentNode.getStyles();
    const classesString = [...classes, ...userSpecifiedClasses].join(' ');
    const node = createNode(currentNode.__key, NodeType.Default, nodelabel, sublabel, classesString);
    return node;
  } else if ($isCompoundNodeContainer(currentNode) && currentNode.getChildren().length > 1) {
    const compoundNodeTitle = getCompoundNodeTitle(currentNode);
    const nodelabel = getNodelabel(compoundNodeTitle);
    const sublabel = getSublabel(compoundNodeTitle);
    const classes = currentNode.getStyles();
    const userSpecifiedClasses = getUserSpecifiedClasses(compoundNodeTitle) || [];
    const compoundChildren = getCompoundNodeChildren(currentNode);
    const classesString = [...classes, ...userSpecifiedClasses].join(' ');

    const node = createNode(currentNode.__key, NodeType.CompoundParent, nodelabel, sublabel, classesString, compoundChildren);
    return node;
  } else if ($isDescriptionNodeContainer(currentNode) && currentNode.getChildren().length > 1) {
    const descriptionTitle = getDescriptionNodeTitle(currentNode);
    const nodelabel = getNodelabel(descriptionTitle);
    const sublabel = getSublabel(descriptionTitle);
    const classes = currentNode.getStyles();
    const userSpecifiedClasses = getUserSpecifiedClasses(descriptionTitle) || [];
    const descriptionBody = getDescriptionNodeBody(currentNode);
    const classesString = [...classes, ...userSpecifiedClasses].join(' ');
    const bodyClasses = currentNode.getChildren()[1]?.getStyles().join(' ');

    const node = createNode(currentNode.__key, NodeType.Description, nodelabel, sublabel, classesString, undefined, descriptionBody, bodyClasses);
    return node;
  }
}

function getNodelabel(node: DefaultNode | CompoundNodeTitle | CompoundNodeBody | DescriptionNodeTitle | DescriptionNodeBody) {
  return node
    .getChildren()
    .filter((child) => $isNotTokenNode(child))
    .map((node) => node.getTextContent())
    .join('');
}

function getSublabel(node: DefaultNode | CompoundNodeTitle | CompoundNodeBody | DescriptionNodeTitle | DescriptionNodeBody) {
  return node
    .getChildren()
    .filter((child) => $isSublabelToken(child))[0]
    ?.getTextContent()
    .slice(2);
}

function getUserSpecifiedClasses(node: DefaultNode | CompoundNodeTitle | CompoundNodeBody | DescriptionNodeTitle | DescriptionNodeBody) {
  return node
    .getChildren()
    .filter((child) => $isClassesToken(child))[0]
    ?.getTextContent()
    .slice(1, -1)
    .split('.');
}

function getEdgelabel(node: StyledNode) {
  return node
    .getChildren()
    .filter((child) => $isEdgelabelToken(child))[0]
    ?.getTextContent()
    .slice(0, -2);
}

function getCompoundNodeTitle(node: CompoundNodeContainer) {
  return node.getChildren().filter((child) => $isCompoundNodeTitle(child))[0] as CompoundNodeTitle;
}

function getCompoundNodeBodyNodes(node: CompoundNodeContainer) {
  return node.getChildren().filter((child) => $isCompoundNodeBody(child)) as CompoundNodeBody[];
}

function getCompoundNodeChildren(node: StyledNode) {
  return getCompoundNodeBodyNodes(node).map((compoundBodyNode) => {
    const nodelabel = getNodelabel(compoundBodyNode);
    const sublabel = getSublabel(compoundBodyNode);
    const userSpecifiedClasses = getUserSpecifiedClasses(compoundBodyNode) || [];
    const classes = compoundBodyNode.getStyles();
    const classesString = [...classes, ...userSpecifiedClasses].join(' ');
    const node = createNode(compoundBodyNode.__key, NodeType.CompoundChild, nodelabel, sublabel, classesString);
    return node;
  });
}
function getDescriptionNodeTitle(node: DescriptionNodeContainer) {
  return node.getChildren().filter((child) => $isDescriptionNodeTitle(child))[0] as DescriptionNodeTitle;
}

function getDescriptionNodeBody(node: DescriptionNodeContainer) {
  const bodyNode = node.getChildren()[1]?.getTextContent() || '';
  return bodyNode;
}

function createEdgeFromIds(childId: string, parentId: string, isCompound: boolean, edgeLabel?: string): IEdge {
  return {
    id: `${parentId}-${childId}`,
    source: parentId,
    target: childId,
    isCompound: isCompound,
    label: edgeLabel,
  };
}

function createNode(
  nodeId: string,
  nodeType: NodeType,
  nodeLabel: string,
  subLabel?: string,
  classes?: string,
  children?: INode[],
  body?: string,
  bodyClasses?: string
): INode {
  return {
    id: nodeId,
    type: nodeType,
    label: nodeLabel,
    sublabel: subLabel,
    classes: classes,
    compoundChildren: children,
    body: body,
    bodyClasses: bodyClasses,
  };
}

function $isNotTokenNode(node: LexicalNode): boolean {
  return !$isEdgelabelToken(node) && !$isSublabelToken(node) && !$isClassesToken(node);
}
