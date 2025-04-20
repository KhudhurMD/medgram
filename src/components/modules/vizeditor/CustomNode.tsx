import { EditorContent } from '@tiptap/react';
import { Notches } from '@phosphor-icons/react';

import { Plus } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Handle, Position, NodeResizeControl } from 'reactflow';
import {
  appObserver,
  NODE_ADD_CHILD_COMMAND,
  NODE_ADD_SIBLING_COMMAND,
  NODE_SET_CONTENT_COMMAND,
  NODE_SET_SELECTION_COMMAND,
} from '../../../utils/appcommands';
import { useGlobalEditor } from './TextEditorContextProvider';
import { FloatingMenuBar } from './FloatingMenu';

interface CustomNodeProps {
  id: string;
  data: {
    content: string;
  };
  selected: boolean;
  isConnectable: boolean;
}

const controlStyle = {
  background: 'transparent',
  border: 'none',
};

export const CustomNode = ({ id, data, isConnectable, selected }: CustomNodeProps) => {
  const { editor, setContent, getContent } = useGlobalEditor();
  const [isEditable, setIsEditable] = useState(false);

  const onNodeAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    appObserver.dispatch(NODE_ADD_CHILD_COMMAND, { nodeId: id });
  };

  const onDoubleClick = () => {
    if (isEditable) {
      return;
    }
    setContent(data.content);
    editor?.commands.focus();
    setIsEditable(true);
  };

  const onNodeBlur = (e: React.FocusEvent) => {
    const parentHasKeepFocus = e.relatedTarget?.closest('.keepfocus') || e.relatedTarget?.closest('.tiptap');
    if (e.relatedTarget && parentHasKeepFocus) {
      editor?.commands.focus();
      return;
    }
    setIsEditable(false);
    appObserver.dispatch(NODE_SET_CONTENT_COMMAND, { nodeId: id, content: getContent() });
  };

  // useEffect(() => {
  //   const handleKeyPress = (e: KeyboardEvent) => {
  //     console.log(e.key);
  //     if (e.key === 'c' && !isEditable && selected) {
  //       appObserver.dispatch(NODE_ADD_CHILD_COMMAND, { nodeId: id });
  //     }
  //
  //     if (e.key === 's' && !isEditable && selected) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       appObserver.dispatch(NODE_ADD_SIBLING_COMMAND, { nodeId: id });
  //     }
  //
  //     // arrow up
  //     if (e.key === 'ArrowUp') {
  //       console.info('Arrow up');
  //     }
  //   };
  //   document.addEventListener('keypress', handleKeyPress);
  //   return () => {
  //     document.removeEventListener('keypress', handleKeyPress);
  //   };
  // }, [isEditable, id, selected]);

  return (
    // eslint-disable-next-line
    <div
      className={`vizeditor-node relative bg-white border min-w-[170px] max-w-[250px] whitespace-pre-wrap border-stone-300 rounded-lg ${
        selected ? 'border-[1.5px] border-gray-900' : ''
      }
       `}
      onDoubleClick={onDoubleClick}
      onBlur={onNodeBlur}
      onKeyUp={(e) => {
        if (e.key === 'Escape') {
          setIsEditable(false);
          appObserver.dispatch(NODE_SET_CONTENT_COMMAND, { nodeId: id, content: getContent() });
          appObserver.dispatch(NODE_SET_SELECTION_COMMAND, { nodeId: id });
          const nodeByDataId = document.querySelector(`[data-id="${id}"]`) as HTMLElement | undefined;
          nodeByDataId?.focus();
        }
      }}
    >
      <NodeResizeControl style={controlStyle} minWidth={170} maxWidth={250} minHeight={50} position={'bottom-right'}>
        <div className="absolute text-gray-400 bottom-[2px] right-[1px] w-5 h-5 flex items-center justify-center hide-on-export">
          <Notches size={12} />
        </div>
      </NodeResizeControl>

      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      {editor && isEditable && <FloatingMenuBar editor={editor} />}
      {isEditable && (
        <EditorContent
          editor={editor}
          className="nodrag cursor-text prose-sm prose-p:p-0 prose-p:m-0 prose-headings:p-0 prose-headings:m-0 prose-ul:list-disc prose-ol:list-decimal prose-ul:ml-2 prose-ul:mt-0 prose-li:pl-0.5 prose-ol:ml-2 prose-p:leading-snug is-focused rounded-lg prose-p:text-left whitespace-pre-wrap"
        />
      )}

      {!isEditable && (
        <article className="prose-sm prose-p:p-0 prose-p:m-0 prose-headings:p-0 prose-headings:m-0 prose-ul:list-disc prose-ol:list-decimal prose-ul:ml-2 prose-li:pl-0.5 prose-ol:ml-2 prose-p:leading-snug prose-p:text-left whitespace-pre-wrap prose-ul:mt-0">
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
        </article>
      )}
      {/* Plus Button */}
      {/* eslint-disable-next-line */}
      <div
        className="absolute min-w-[170px] max-w-[250px] flex items-center justify-center z-10 bottom-[-30px] left-0 w-full hide-on-export"
        onClick={onNodeAddChild}
      >
        <div
          className={[
            'text-white w-4 h-4 hover:bg-primary-600 rounded-full p-0.5 mb-1 cursor-pointer flex items-center',
            selected && !isEditable ? 'bg-primary-500' : 'bg-gray-600',
          ].join(' ')}
        >
          <Plus size={24} />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
};
