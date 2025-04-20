import { Plus } from '@phosphor-icons/react';

type PlusButtonProps = React.HTMLAttributes<HTMLDivElement>;

export const PlusButton = (props: PlusButtonProps) => {
  return (
    <div className="absolute flex items-center justify-center z-10 bottom-0 w-10 h-10">
      <div className="text-white w-4 h-4 bg-primary-500 group-hover:bg-primary-400 invisible group-hover:visible rounded-full p-0.5 mb-1 cursor-pointer flex items-center">
        <Plus size={24} />
      </div>
    </div>
  );
};
