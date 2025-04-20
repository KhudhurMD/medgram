import { GraphDataSchemaType, GraphDataSchema, GraphDataLocalStorageSchema } from '../types/graph';

export function getLocalStorageGraphById(graphId: string): GraphDataSchemaType | null {
  if (typeof window == 'undefined') return null;
  const AllLocalStorageItems = getAllLocalStorageGraphs();
  if (!AllLocalStorageItems) return null;
  const matchingGraphId = AllLocalStorageItems.find((item) => {
    if (item[0] == graphId && GraphDataSchema.safeParse(item[1]).success) {
      return true;
    }
  });
  return matchingGraphId ? matchingGraphId[1] : null;
}

export function getAllLocalStorageGraphs(): GraphDataLocalStorageSchema | null {
  if (typeof window == 'undefined') return null;
  const graphStore = localStorage.getItem('graphs');
  if (graphStore && GraphDataLocalStorageSchema.safeParse(Object.entries(JSON.parse(graphStore))).success) {
    return Object.entries(JSON.parse(localStorage.getItem('graphs') || '{}'));
  }
  return null;
}
