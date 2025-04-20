import React, { useContext } from 'react';
import { useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import { BackColor } from './extensions/BackColor';
import FloatingMenu from '@tiptap/extension-floating-menu';
import { FontSize } from './extensions/FontSize';
import { Underline } from '@tiptap/extension-underline';

interface EditorContextType {
  editor: Editor | null;
  setContent: (content: string | null) => void;
  getContent: () => string | null;
}

const EditorContext = React.createContext<EditorContextType | null>(null);

const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      BackColor,
      BubbleMenu.configure({
        updateDelay: 0,
      }),
      FloatingMenu.configure({
        element: document.querySelector('.floating-menu') as HTMLElement,
      }),
      TextStyle,
      FontSize,
      Underline,
    ],
    content: null,
  });

  const setContent = (content: string | null) => {
    if (editor) {
      editor.commands.setContent(content);
    }
  };

  const getContent = (): string | null => {
    return editor ? editor.getHTML() : null;
  };

  return (
    <EditorContext.Provider
      value={{
        editor,
        setContent,
        getContent,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

const useGlobalEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useGlobalEditor must be used within an EditorProvider');
  }
  return context;
};

export { EditorProvider, useGlobalEditor };
