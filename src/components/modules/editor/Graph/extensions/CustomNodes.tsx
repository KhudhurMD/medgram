import { Plus } from '@phosphor-icons/react';
import { ReactElement } from 'react';
import { Handle, Position } from 'reactflow';
import { useMediaQuery } from 'usehooks-ts';
import { useAppSelector } from '../../../../../store/storeHooks';
import { ReactFlowNode } from '../../../../../types/ReactFlow';
import { appObserver, NODE_ADD_CHILD_COMMAND, NODE_ADD_SIBLING_COMMAND } from '../../../../../utils/appcommands';

interface CompoundNodeProps {
  data: {
    label: string;
    sublabel: string;
    classes: string;
    children: ReactFlowNode[];
  };
}

export function compoundNode({ data }: CompoundNodeProps): ReactElement {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="compound-node-container group">
        <BottomHandlerOverlay />
        <RightHandlerOverlay />
        <div className={`compound-node ${data.classes}`}>
          <div className="header">{data.label}</div>
          <div>
            {data.children &&
              data.children.map(({ data: { label, sublabel, classes } }, index) => (
                <div key={index}>
                  <div className={`child-node ${classes}`}>{label}</div>
                  {sublabel && sublabel != '' && <div className="sublabel">{sublabel}</div>}
                </div>
              ))}
          </div>
        </div>
        {data.sublabel && data.sublabel != '' && <div className="sublabel">{data.sublabel}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" />
    </>
  );
}

interface DescriptionNodeProps {
  data: {
    label: string;
    sublabel: string;
    classes: string;
    body: string;
    bodyClasses: string;
  };
}

export function descriptionNode({ data }: DescriptionNodeProps): ReactElement {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className={`${data.classes} group`}>
        <BottomHandlerOverlay />
        <RightHandlerOverlay />
        <div className="description-node-title">{data.label}</div>
        <div className={`description-node-body ${data.bodyClasses}`}>{data.body}</div>
      </div>
      {data.sublabel && data.sublabel != '' && <div className="sublabel">{data.sublabel}</div>}
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" />
    </>
  );
}

export function defaultNode({ data }: { data: { label: string; sublabel: string; classes: string } }) {
  const selectedNode = useAppSelector((state) => state.texteditor.selectedNode);
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="group nodeWithSubLabelContainer">
        <BottomHandlerOverlay />
        <RightHandlerOverlay />
        <div className={`nodeWithSubLabel ${data.classes}`}>{data.label}</div>
        {data.sublabel && data.sublabel != '' && <div className="sublabel">{data.sublabel}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" className="" />
      <Handle className="" type="source" position={Position.Bottom} id="b" />
    </>
  );
}

export function BottomHandlerOverlay() {
  const selectedNode = useAppSelector((state) => state.texteditor.selectedNode);
  const canEdit = useAppSelector((state) => state.graph.canEdit);
  const isMobile = useMediaQuery('(max-width: 768px)');
  if (canEdit == false) return null;
  if (isMobile) return null;

  return (
    <div className="absolute w-full flex items-center justify-center bottom-[-10px] z-10">
      <div
        className="text-white w-4 h-4 bg-primary-500 group-hover:bg-primary-400 invisible group-hover:visible rounded-full p-0.5 mb-1 cursor-pointer flex items-center"
        onClick={(e) => {
          e.stopPropagation();
          selectedNode && appObserver.dispatch(NODE_ADD_CHILD_COMMAND, { nodeId: selectedNode });
        }}
      >
        <Plus size={24} />
      </div>
    </div>
  );
}

export function RightHandlerOverlay() {
  const selectedNode = useAppSelector((state) => state.texteditor.selectedNode);
  const canEdit = useAppSelector((state) => state.graph.canEdit);
  const isMobile = useMediaQuery('(max-width: 768px)');
  if (canEdit == false) return null;
  if (isMobile) return null;

  return (
    <div className="absolute h-full flex items-center justify-center right-[-8px] z-10">
      <div
        className="text-white w-4 h-4 bg-primary-500 group-hover:bg-primary-400 invisible group-hover:visible rounded-full p-0.5 mb-1 cursor-pointer flex items-center"
        onClick={(e) => {
          e.stopPropagation();
          selectedNode && appObserver.dispatch(NODE_ADD_SIBLING_COMMAND, { nodeId: selectedNode });
        }}
      >
        <Plus size={24} />
      </div>
    </div>
  );
}
