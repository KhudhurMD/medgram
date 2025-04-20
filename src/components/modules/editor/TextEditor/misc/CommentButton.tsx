import { ChatTeardrop, ChatTeardropDots } from '@phosphor-icons/react';
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { classNames } from '../../../../../utils/tailwind';
import { useState } from 'react';

interface CommentButtonProps {
  id: string | null;
  nodeKey: string;
}

export function CommentButton({ id, nodeKey }: CommentButtonProps) {
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  console.log(nodeKey);

  function handleButtonClick() {
    console.log(id);
  }
  return (
    <button onClick={() => handleButtonClick()} className={classNames('text-gray-400', isSelected && 'border bg-blue-300 rounded-md text-white')}>
      <ChatTeardropDots size={24} />
    </button>
  );
}
