import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Trash, Warning, Spinner } from '@phosphor-icons/react';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { getMostRecentSavedGraph } from '../../../pages/v1/edit/[[...params]]';
import { AppDispatch, loadGraphAction } from '../../../store/store';
import { useAppDispatch } from '../../../store/storeHooks';
import { GraphDataLocalStorageSchema } from '../../../types/graph';
import { api } from '../../../utils/api';
import { getAllLocalStorageGraphs } from '../../../utils/localstorage';
import { PreviewGraphProvider } from '../editor/ExportDialog/components/PreviewGraph';

dayjs.extend(relativeTime);

export const GraphsPage: NextPage = () => {
  const [localStorageGraphs, setLocalStorageGraphs] = useLocalStorageGraphs();
  const sessionStatus = useSession().status;
  const userId = useSession().data?.user?.id;
  const cloudGraphsQuery = api.graph.getUserGraphs.useQuery({}, { enabled: userId != undefined });
  const cloudGraphs = cloudGraphsQuery.data;
  const cloudGraphsId = cloudGraphs?.map((graph) => graph.id);
  const deleteGraph = api.graph.deleteGraph.useMutation({ onSuccess: () => cloudGraphsQuery.refetch() });
  const dispatch = useAppDispatch();
  const localStorageArr = localStorageGraphs && localStorageGraphs.map((graph) => graph[1]);
  return (
    <div>
      {(cloudGraphsQuery.status != 'loading' || sessionStatus == 'unauthenticated') && (
        <>
          <h2 className="text-xl text-gray-700 mb-4">Cloud Graphs</h2>
          {cloudGraphs && (
            <div className="flex flex-wrap bg-primary-50 rounded-lg p-4 pb-0 mb-8">
              <>
                {cloudGraphs &&
                  cloudGraphs.map((graph) => {
                    return (
                      <>
                        <div className="w-full md:w-1/2">
                          <div className="md:mr-6 mb-6 bg-white flex flex-row justify-between overflow-hidden rounded-lg border border-gray-200 pl-6 shadow-sm">
                            <div className="mr-4 flex flex-col justify-between py-4">
                              <div>
                                <p className="text-gray-500">Updated {dayjs(graph.updatedAt).toNow()}</p>
                                <h2 className="text-xl text-gray-700">
                                  <Link href={`/v1/edit/${graph.id}`}>{graph.name}</Link>
                                </h2>
                              </div>
                              <div className="flex flex-row items-center">
                                <div className=""></div>
                                <div className="">
                                  <button
                                    className="mr-2 flex items-center gap-1 rounded-lg border border-gray-200 p-2 px-4 text-gray-600"
                                    onClick={() => deleteGraph.mutate({ id: graph.id })}
                                  >
                                    <Trash className="text-gray-400" size={22} />
                                    <p>Drop</p>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className='item-center relative h-48 w-48 border-l border-gray-200 after:absolute after:top-0 after:left-0 after:z-10 after:h-full after:w-full after:content-[""]'>
                              <PreviewGraphProvider
                                parsedNodes={JSON.parse(graph.graphData).graph.nodes}
                                parsedEdges={JSON.parse(graph.graphData).graph.edges}
                                shouldLayout={false}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </>
            </div>
          )}

          {!cloudGraphs && sessionStatus == 'unauthenticated' && (
            <div className="flex flex-wrap border border-orange-500 flex-row text-orange-700 bg-orange-50 rounded-lg p-3 px-4 gap-2 mb-8 items-center">
              <Warning size={22} className="text-orange-600" weight="fill" />
              <p>Please login to sync the graphs to the cloud and use them cross-platform!</p>
            </div>
          )}
          {localStorageGraphs && <h2 className="text-xl text-gray-700 mb-4">Local Graphs</h2>}

          <div className="flex flex-wrap">
            {localStorageArr && localStorageArr.length > 0 ? (
              localStorageArr
                .filter((graph) => !cloudGraphsId?.includes(graph.graphmetadata.id))
                .map((graph) => {
                  return (
                    <div className="md:w-1/2 w-full" key={graph.graphmetadata.id}>
                      <div className="md:mr-6 mb-6 flex flex-row justify-between overflow-hidden rounded-lg border border-gray-200 pl-6 shadow-sm">
                        <div className="mr-4 flex flex-col justify-between py-4">
                          <div>
                            <p className="text-gray-500">Updated ${dayjs(graph.graphmetadata.date).toNow()}</p>
                            <h2 className="text-xl text-gray-700">
                              <Link href={`/v1/edit/${graph.graphmetadata.id}`}>{graph.graphmetadata.name}</Link>
                            </h2>
                          </div>
                          <div className="flex flex-row items-center">
                            <div className=""></div>
                            <div className="">
                              <button
                                className="mr-2 flex items-center gap-1 rounded-lg border border-gray-200 p-2 px-4 text-gray-600"
                                onClick={() =>
                                  deleteGraphFromLocalStorage(graph.graphmetadata.id, localStorageGraphs, setLocalStorageGraphs, dispatch)
                                }
                              >
                                <Trash className="text-gray-400" size={22} />
                                <p>Delete</p>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className='item-center relative h-48 w-48 border-l border-gray-200 after:absolute after:top-0 after:left-0 after:z-10 after:h-full after:w-full after:content-[""]'>
                          {/* @ts-ignore */}
                          <PreviewGraphProvider parsedNodes={graph.graph?.nodes} parsedEdges={graph.graph?.edges} shouldLayout={false} />
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-gray-500">No graphs saved yet</p>
            )}
          </div>
        </>
      )}
      {(sessionStatus == 'loading' || (cloudGraphsQuery.status == 'loading' && sessionStatus != 'unauthenticated')) && <Spinner className="mb-3" />}
      {sessionStatus == 'loading' && <p>Loading Session...</p>}
      {cloudGraphsQuery.status == 'loading' && sessionStatus == 'authenticated' && <p>Loading your graphs... </p>}
    </div>
  );
};

function getSortedLocalStorageGraphs(): GraphDataLocalStorageSchema | null {
  if (typeof window === 'undefined') return null;
  const localStorageItems = getAllLocalStorageGraphs();
  if (!localStorageItems) return null;
  const sortedLocalStorageGraphs = localStorageItems.sort((a, b) => {
    return dayjs(b[1].graphmetadata.date).unix() - dayjs(a[1].graphmetadata.date).unix();
  });
  return sortedLocalStorageGraphs;
}

function deleteGraphFromLocalStorage(
  id: string,
  graphs: GraphDataLocalStorageSchema | null,
  setGraphs: Dispatch<SetStateAction<GraphDataLocalStorageSchema | null>>,
  dispatch: AppDispatch
) {
  const mostRecentGraph = getMostRecentSavedGraph()?.graphmetadata.id;
  if (graphs) {
    const filteredGraphs = graphs.filter((graph) => graph[0] !== id);
    setGraphs(filteredGraphs);
    if (mostRecentGraph === id) {
      const newMostRecentGraph = filteredGraphs[0];
      newMostRecentGraph && dispatch(loadGraphAction(newMostRecentGraph[1]));
    }
  }
}

function useLocalStorageGraphs() {
  const [localStorageGraphs, setLocalStorageGraphs] = useState<GraphDataLocalStorageSchema | null>(null);
  useEffect(() => {
    setLocalStorageGraphs(getSortedLocalStorageGraphs());
  }, []);

  useEffect(() => {
    // set localStorageGraphs to the value
    if (localStorageGraphs) {
      if (GraphDataLocalStorageSchema.safeParse(localStorageGraphs).success !== true) {
        return;
      }
      localStorage.setItem('graphs', JSON.stringify(Object.fromEntries(localStorageGraphs)));
    }
  }, [localStorageGraphs]);
  return [localStorageGraphs, setLocalStorageGraphs] as const;
}

export default GraphsPage;
