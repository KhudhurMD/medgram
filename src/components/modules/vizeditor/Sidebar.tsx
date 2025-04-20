import React from 'react';
import { useGlobalEditor } from './TextEditorContextProvider';

const white = '#fff';
const lightBlue = '#eff6ff'; // Tailwind blue-50
const lightGreen = '#f0fdf4'; // Tailwind green-50
const lightYellow = '#fefce8'; // Tailwind yellow-50
const lightRed = '#fef2f2'; // Tailwind red-50

const black = '#000';
const gray400 = '#cbd5e0';
const gray600 = '#718096';
const gray800 = '#2d3748';

const MenuBar = () => {
  const { editor } = useGlobalEditor();

  if (!editor) {
    return null;
  }
  const currentAlignment = ['left', 'center', 'right', 'justify'].find((alignment) => editor.isActive({ textAlign: alignment }));

  return (
    // eslint-disable-next-line
    <div className="keepfocus" tabIndex={0}>
      <p className="mt-4 mb-4 text-[19px] font-medium">Box Properties</p>
      {!editor.isFocused && (
        <div className="p-2 bg-gray-50 rounded-lg mt-3 px-3 py-1.5 border border-dashed border-gray-500 text-sm text-gray-500">
          Please double-click a box to customize its properties.
        </div>
      )}

      {editor.isFocused && (
        <div>
          <p className="mt-5 mb-2 text-gray-900">Background Color</p>
          <div className="flex gap-1.5 flex-wrap">
            {[white, lightBlue, lightGreen, lightYellow, lightRed].map((color) => (
              <SidebarBackgroundColorButton
                key={color}
                onClick={() => editor.chain().focus().setBackColor(color).run()}
                isActive={editor.commands.getBackColor() === color}
                color={color}
              />
            ))}
          </div>

          <p className="mt-5 mb-2 text-gray-900">Font Color</p>
          <div className="flex gap-1.5 flex-wrap">
            {[gray400, gray600, gray800, black].map((color) => (
              <SidebarTextColorButton
                key={color}
                onClick={() => editor.chain().focus().setColor(color).run()}
                isActive={editor.getAttributes('textStyle').color === color || (editor.getAttributes('textStyle').color === '' && color === black)}
                color={color}
              />
            ))}
          </div>

          <p className="mt-5 mb-1.5 text-gray-900">Font style</p>
          <div className="flex gap-1.5 flex-wrap">
            <SidebarButton onClick={() => editor.commands.toggleBold()} isActive={editor.isActive('bold')}>
              Bold
            </SidebarButton>
            <SidebarButton
              onClick={() => {
                editor.commands.toggleItalic();
              }}
              isActive={editor.isActive('italic')}
            >
              Italic
            </SidebarButton>
            <SidebarButton onClick={() => editor.commands.toggleUnderline()} isActive={editor.isActive('underline')}>
              Underline
            </SidebarButton>
          </div>

          <p className="mt-5 mb-1.5 text-gray-900">Font size</p>
          <div className="flex gap-1.5 flex-wrap">
            <SidebarButton onClick={() => editor.commands.setFontSize('12px')} isActive={editor.commands.getFontSize() === '12px'}>
              Small
            </SidebarButton>
            <SidebarButton
              onClick={() => {
                editor.commands.setFontSize('14px');
              }}
              isActive={editor.commands.getFontSize() === '14px' || editor.commands.getFontSize() == ''}
            >
              Medium
            </SidebarButton>
            <SidebarButton onClick={() => editor.commands.setFontSize('16px')} isActive={editor.commands.getFontSize() === '16px'}>
              Large
            </SidebarButton>
          </div>

          <p className="mt-5 mb-1.5 text-gray-900">Alignment</p>
          <div className="flex gap-1.5 flex-wrap">
            <SidebarButton
              onClick={() => {
                console.info('currentAlignment', currentAlignment);
                editor.commands.setTextAlign('left');
              }}
              isActive={currentAlignment === 'left'}
            >
              Left
            </SidebarButton>

            <SidebarButton onClick={() => editor.commands.setTextAlign('center')} isActive={currentAlignment === 'center'}>
              Center
            </SidebarButton>

            <SidebarButton onClick={() => editor.commands.setTextAlign('right')} isActive={currentAlignment === 'right'}>
              Right
            </SidebarButton>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarButton = ({
  onClick,
  isActive,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex gap-1 text-sm transition-all px-1.5 py-0.5 rounded-lg duration-150 border border-gray-200  ${
        isActive ? 'bg-black text-white border-transparent' : 'hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
};

const SidebarBackgroundColorButton = ({ onClick, isActive, color }: { onClick: () => void; isActive: boolean; color: string }) => {
  return (
    <button
      onClick={onClick}
      className={`h-5 w-5 flex gap-1 text-xs transition-all px-1 py-0.5 rounded-md duration-150 border   ${
        isActive ? 'border-black text-white border-transparent border-solid' : 'hover:bg-gray-100 border-gray-400 border-dashed'
      }`}
      style={{ backgroundColor: color }}
    />
  );
};

const SidebarTextColorButton = ({ onClick, isActive, color }: { onClick: () => void; isActive: boolean; color: string }) => {
  return (
    <button
      onClick={onClick}
      className={`h-5 w-5 flex gap-1 text-xs transition-all px-1 py-0.5 rounded-md duration-150 border   ${
        isActive ? 'border-black text-white border-solid' : 'hover:bg-gray-100 border-transparent'
      }`}
      style={{ backgroundColor: color }}
    />
  );
};

export default function Tiptap() {
  return <MenuBar />;
}
