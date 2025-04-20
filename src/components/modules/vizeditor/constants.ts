import { Edge, Node } from 'reactflow';

export const StarterNodes = [
  {
    id: '1',
    type: 'customNode',
    data: { content: '<p>Double click me to edit</p>' },
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    type: 'customNode',
    data: { content: '<p>Use the plus icon to<br> add more boxes</p>' },
    position: { x: 0, y: 100 },
    parentId: '1',
  },
  {
    id: '3',
    type: 'customNode',
    data: { content: '<p>You can also change<br>the properties <br>on the right</p>' },
    position: { x: -100, y: 100 },
    parentId: '2',
  },
  {
    id: '4',
    type: 'customNode',
    data: { content: '<p>Drag and drop me to<br>move</p>' },
    position: { x: 100, y: 100 },
    parentId: '2',
  },
] as Node[];

export const StarterEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '2', target: '3' },
  { id: '2-4', source: '2', target: '4' },
] as Edge[];
