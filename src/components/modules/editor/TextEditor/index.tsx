import { ListItemNode, ListNode } from '@lexical/list';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { NodeEventPlugin } from '@lexical/react/LexicalNodeEventPlugin';
import { $getNodeByKey, EditorConfig, LexicalEditor, ParagraphNode, TextNode } from 'lexical';
import React, { useEffect } from 'react';

import { StyledNode } from './common/stylednode';
import { DefaultNode } from './nodes/defaultnode';
import { AutoInsertListAndStyledNodePlugin } from './plugins/AutoInsertListPlugin';
import { ColoredTokensPlugin } from './plugins/ColoredTokensPlugin';
import { ClassesToken } from './plugins/ColoredTokensPlugin/ClassesToken';
import { EdgeLabelToken } from './plugins/ColoredTokensPlugin/EdgeLabelToken';
import { SubLabelToken } from './plugins/ColoredTokensPlugin/SubLabelToken';
import { CompoundNodePlugin } from './plugins/CompoundNodePlugin';
import { CompoundNodeBody } from './plugins/CompoundNodePlugin/CompoundNodeBody';
import { CompoundNodeContainer } from './plugins/CompoundNodePlugin/CompoundNodeContainer';
import { CompoundNodeTitle } from './plugins/CompoundNodePlugin/CompoundNodeTitle';
import { DeleteCharacterOutdentPlugin } from './plugins/DeleteCharacterOutdentPlugin';
import { DispatchChangesToGraphEditor as DispatchChanges } from './plugins/DispatchChangesToGraphEditor';
import { PushStylesToStyledNodePlugin } from './plugins/PushStylesToStyledNodePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import { HighlightLinePlugin } from './plugins/HighlightLinePlugin';
import { useAppDispatch, useAppSelector } from '../../../../store/storeHooks';
import { initialEditorState } from './misc/constants';
import { ReformTreeEscape } from './plugins/ReformTreeEscape';
import { SpaceIndentPlugin } from './plugins/SpaceIndentPlugin';
import { CommentToken, $isCommentNode, $createCommentNode } from './nodes/commenttoken';
import { CustomListItemNode } from './nodes/CustomListItemNode';
import { OverrideListNodesPlugin } from './plugins/OverrideListNodesPlugin';
import { CustomListNode } from './nodes/CustomListNode';
import CollapsiblePlugin from './plugins/CollapsiblePlugin';
import { CollapsibleTitleNode } from './plugins/CollapsiblePlugin/CollapsibleTitleNode';
import { CollapsibleContainerNode } from './plugins/CollapsiblePlugin/CollapsibleContainerNode';
import { CollapsibleContentNode } from './plugins/CollapsiblePlugin/CollapsibleContentNode';
import { TrackEventsPlugin } from './plugins/TrackEventsPlugin';
import { DescriptionNodeContainer } from './plugins/DescriptionNodePlugin/DescriptionNodeContainer';
import { DescriptionNodeTitle } from './plugins/DescriptionNodePlugin/DescriptionNodeTitle';
import { DescriptionNodeBody } from './plugins/DescriptionNodePlugin/DescriptionNodeBody';
import { DescriptionNodePlugin } from './plugins/DescriptionNodePlugin';
import { RestructureFloatingTextPlugin } from './plugins/RestructureFloatingTextPlugin';
import { MaxIndentPlugin } from './plugins/MaxIndentPlugin';
import { appObserver } from '../../../../utils/appcommands';
import { GraphEventsPlugin } from './plugins/GraphEventsPlugin';
import { PreventDeletionOffsetPlugin } from './plugins/PreventDeletionOffsetPlugin';

export function TextEditor() {
  const dispatchAction = useAppDispatch();

  const initialConfig: InitialConfigType = {
    namespace: 'Editor',
    theme,
    onError,
    nodes: [
      ListNode,
      ListItemNode,
      ParagraphNode,
      DefaultNode,
      StyledNode,
      EdgeLabelToken,
      SubLabelToken,
      ClassesToken,
      CompoundNodeContainer,
      CompoundNodeTitle,
      CompoundNodeBody,
      DescriptionNodeContainer,
      DescriptionNodeTitle,
      DescriptionNodeBody,
      CommentToken,
      CollapsibleContainerNode,
      CollapsibleTitleNode,
      CollapsibleContentNode,
      CustomListNode,
      {
        replace: ListNode,
        with: (node: ListNode) => {
          return new CustomListNode(node.__listType, node.__start);
        },
      },
      CustomListItemNode,
      {
        replace: ListItemNode,
        with: (node: ListItemNode) => {
          return new CustomListItemNode(node.__value, node.__checked);
        },
      },
    ],
  };

  return (
    <div className={'w-full flex-col flex h-full'}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextPlugin contentEditable={<ThemedContentEditable />} placeholder={<div></div>} ErrorBoundary={LexicalErrorBoundary} />
        <DeleteCharacterOutdentPlugin />
        <HistoryPlugin />
        <ListPlugin />
        <AutoInsertListAndStyledNodePlugin />
        <ColoredTokensPlugin />
        <CompoundNodePlugin />
        <DescriptionNodePlugin />
        <PushStylesToStyledNodePlugin />
        <DispatchChanges />
        <CollapsiblePlugin />
        <LoadInitialState />
        <TreeDebugPlugin />
        <ReformTreeEscape />
        <SpaceIndentPlugin />
        <HighlightLinePlugin />
        <OverrideListNodesPlugin />
        <RestructureFloatingTextPlugin />
        <TrackEventsPlugin />
        <MaxIndentPlugin />
        <GraphEventsPlugin />
        <PreventDeletionOffsetPlugin />
      </LexicalComposer>
    </div>
  );
}

const theme = {};

function onError(error: any) {
  console.error(error);
}

function TreeDebugPlugin() {
  const debug = useAppSelector((state) => state.texteditor.debug);
  return debug ? <TreeViewPlugin /> : null;
}

function LoadInitialState() {
  const [editor] = useLexicalComposerContext();
  const editorState = useAppSelector((state) => state.texteditor.editorState);
  const graphId = useAppSelector((state) => state.graphmetadata.id);
  const toggleReloadEditor = useAppSelector((state) => state.texteditor.toggleReloadEditor);
  useEffect(() => {
    if (editorState) {
      editor.setEditorState(editor.parseEditorState(editorState));
    }
  }, [graphId, toggleReloadEditor]);

  appObserver.subscribe();
  return null;
}

function InsertCommentPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
      if (textNode.getTextContent() === 'cm') {
        const newCommentNode = $createCommentNode('test');
        textNode.replace(newCommentNode);
      }
    });
  }, [editor]);
  return null;
}

export function ThemedContentEditable() {
  return (
    <ContentEditable className="pt-12 md:pt-1 texteditor overflow-x-scroll overflow-y-visible scrollbar-hide md:overflow-scroll md:p-3 px-3 outline-none h-full" />
  );
}
