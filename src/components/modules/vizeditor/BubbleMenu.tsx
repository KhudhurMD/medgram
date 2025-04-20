import React from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';

export const BubbleMenuBar = ({ editor }: { editor: Editor }) => {
  return (
    <div className="keepfocus">
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="bubble-menu keepfocus flex gap-0.5 px-1 py-0.5 bg-white rounded-lg shadow-md border border-gray-200">
          <BubbleMenuButton
            onClick={() => {
              editor.chain().focus().toggleBold().run();
            }}
            isActive={editor.isActive('bold')}
          >
            Bold
          </BubbleMenuButton>
          <BubbleMenuButton
            onClick={() => {
        editor.chain().focus().setHorizontalRule().run()
            }}
            isActive={editor.isActive('italic')}
          >
            Line
          </BubbleMenuButton>
        </div>
      </BubbleMenu>
    </div>
  );
};

const BubbleMenuButton = ({ onClick, isActive, children }: { onClick: () => void; isActive: boolean; children: React.ReactNode }) => {
  return (
    <button
      onClick={onClick}
      className={`text-sm transition-all px-1.5 py-0.5 rounded-md duration-150 ${isActive ? 'is-active' : 'hover:bg-gray-100'}`}
    >
      {children}
    </button>
  );
};
