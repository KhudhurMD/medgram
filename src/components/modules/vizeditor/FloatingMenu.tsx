import React from 'react';
import { Editor } from '@tiptap/react';
import { Minus } from '@phosphor-icons/react';

export const FloatingMenuBar = ({ editor }: { editor: Editor }) => {
  const shouldShow = () => {
    const { selection } = editor.state;
    const { $from } = selection;
    const depth = $from.depth > 0 ? $from.depth : 1;
    const currentPos = $from.before(depth);

    const currentNode = editor.state.doc.nodeAt(currentPos);
    const prevNode = currentPos - 1 > 0 ? editor.state.doc.nodeAt(currentPos - 1) : null;
    const prevNodeType = prevNode?.type.name;

    const isCurrentNodeEmpty = currentNode?.content.size === 0;
    const isCurrentNodeTextblock = currentNode?.isTextblock;
    const isPrevNodeSeparator = prevNodeType === 'horizontalRule';
    const isPrevNodeList = prevNodeType === 'listItem';

    const shouldShow = isCurrentNodeEmpty && !!isCurrentNodeTextblock && !isPrevNodeSeparator && !isPrevNodeList;

    return shouldShow;
  };

  return (
    <div className="keepfocus hidden sm:flex">
      {shouldShow() && (
        <div className="absolute bottom-[27px] left-5 w-0 h-0 z-10">
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className={`flex gap-1 text-xs transition-all px-1 py-0.5 rounded-md duration-150 border border-gray-300 border-dashed hover:bg-gray-100 z-10`}
          >
            <Minus size={16} />
            Line
          </button>
        </div>
      )}
    </div>
  );
};
