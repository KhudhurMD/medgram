import { DotsThreeOutlineVertical } from '@phosphor-icons/react';
import { Resizable as Reresizable } from 're-resizable';
import { memo, ReactNode, useState } from 'react';
import { classNames } from '../../../utils/tailwind';
import styles from './index.module.css';

const Resizable = ({ children, triggerResize }: { children: ReactNode; triggerResize: () => void }) => {
  const [dragging, setDragging] = useState(false);

  return (
    <Reresizable
      defaultSize={{
        width: '50%',
        height: 'auto',
      }}
      maxWidth="90%"
      minWidth="10%"
      enable={{
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      handleClasses={{ right: styles.Handle }}
      handleComponent={{ right: <Handle dragging={dragging} /> }}
      onResizeStart={() => setDragging(true)}
      onResizeStop={() => {
        setDragging(false);
        triggerResize();
      }}
    >
      {children}
    </Reresizable>
  );
};

export const VerticalResizable = ({ children, triggerResize }: { children: ReactNode; triggerResize: () => void }) => {
  const [dragging, setDragging] = useState(false);

  return (
    <Reresizable
      defaultSize={{
        width: '100%',
        height: '50%',
      }}
      maxHeight="90%"
      minHeight="10%"
      enable={{
        top: true,
        right: false,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      handleComponent={{ right: <Handle dragging={dragging} /> }}
      onResizeStart={() => setDragging(true)}
      onResizeStop={() => {
        setDragging(false);
        triggerResize();
      }}
    >
      {children}
    </Reresizable>
  );
};
const ResizableTab = memo(({ children, triggerResize }: { children: ReactNode; triggerResize: () => void }) => {
  return <Resizable triggerResize={triggerResize}>{children}</Resizable>;
});

ResizableTab.displayName = 'TabPane';

export default ResizableTab;

const Handle = ({ dragging = false }: { dragging: boolean }) => (
  <div className={classNames('h-full flex bg-white items-start w-3 border-r border-gray-200 hover:bg-gray-100', dragging && 'bg-gray-100')}></div>
);
