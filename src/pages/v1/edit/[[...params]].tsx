import dayjs from 'dayjs';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Spinner } from '@phosphor-icons/react';
import Graph from '../../../components/modules/editor/Graph';
import posthog from 'posthog-js';
import React, { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { Alert } from '../../../components/elements/alert';
import { Shell } from '../../../components/layouts/Shell';
import ResizableTab, { VerticalResizable } from '../../../components/layouts/TabPane';
import { graphSlice } from '../../../components/modules/editor/Graph/slice';
import GraphMetadata from '../../../components/modules/editor/GraphMetadata';
import MobileTabSwitcher from '../../../components/modules/editor/MobileTabSwitcher';
import StyleEditor from '../../../components/modules/editor/StyleEditor';
import { TextEditor } from '../../../components/modules/editor/TextEditor';
import { textEditorSlice } from '../../../components/modules/editor/TextEditor/slice';
import NoSSRWrapper from '../../../components/utility/NoSSRWrapper';
import { newGraphCreatedAction, loadGraphAction, AppDispatch } from '../../../store/store';
import { useAppDispatch, useAppSelector } from '../../../store/storeHooks';
import { GraphDataSchemaType, GraphDataSchema } from '../../../types/graph';
import { api } from '../../../utils/api';
import { classNames } from '../../../utils/tailwind';
import { v4 as uuidv4 } from 'uuid';
import { getLocalStorageGraphById, getAllLocalStorageGraphs } from '../../../utils/localstorage';
import { CommonHead } from '../../../components/elements/CommonHead';

export const Edit: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const routerQuery = router.query;
  const graphIdParam = routerQuery.params?.toString();
  const session = useSession();
  const userId = session?.data?.user?.id;
  const graphId = useAppSelector((state) => state.graphmetadata.id);
  const [isGraphFound, setIsGraphFound] = React.useState(true);
  const cloudGraphQuery = api.graph.getGraph.useQuery(
    { id: graphIdParam! },
    {
      enabled: graphIdParam != undefined && userId != undefined,
      refetchOnWindowFocus: false,
    }
  );
  const cloudGraph = cloudGraphQuery.data;

  const isNotMobile = useMediaQuery('(min-width: 768px)');
  const [shouldTextEditorShow, setShouldTextEditorShow] = React.useState(true);

  useEffect(() => {
    // This code is executed on the client side only
    if (!router.isReady) return;
    if (graphId == graphIdParam && graphId != undefined && cloudGraph == undefined) return;

    // If no params for graph id are passed, direct to the most recent graph
    if (graphIdParam == undefined) {
      const mostRecentGraphId = getMostRecentSavedGraph()?.graphmetadata.id;
      if (mostRecentGraphId) {
        router.push(`/v1/edit/${mostRecentGraphId}`);
        return;
      }
      router.push(`/v1/edit/new`);
      return;
    }

    // If new graph is requested, create a new graphIdParam
    if (graphIdParam == 'new') {
      const newGraphId = uuidv4();
      dispatch(newGraphCreatedAction(newGraphId.toString()));
      setTimeout(() => {
        dispatch(graphSlice.actions.resizingTriggered());
      }, 50);
      setIsGraphFound(true);
      router.push(`/edit/${newGraphId}`, undefined, { shallow: true });
      return;
    }

    // Find the graph in local storage and load it
    if (graphIdParam) {
      const localStorageGraph = getLocalStorageGraphById(graphIdParam);
      if (cloudGraph) {
        // Check if more recent version of graph is in local storage
        const localStorageGraph = getLocalStorageGraphById(graphIdParam);
        const localStorageGraphDate = dayjs(localStorageGraph?.graphmetadata.date || 0);
        console.log('Checking cloud graph date');
        const cloudGraphDate = dayjs(cloudGraph.updatedAt);
        if (cloudGraphDate.isBefore(localStorageGraphDate)) {
          return;
        }
        dispatch(loadGraphAction(JSON.parse(cloudGraph.graphData || '{}')));
        setTimeout(() => {
          dispatch(textEditorSlice.actions.reloadEditor());
        }, 50);
        setTimeout(() => {
          dispatch(graphSlice.actions.resizingTriggered());
        }, 50);
        setIsGraphFound(true);
        return;
      }
      if (localStorageGraph) {
        dispatch(loadGraphAction(localStorageGraph));
        setTimeout(() => {
          dispatch(graphSlice.actions.resizingTriggered());
        }, 50);
        setIsGraphFound(true);
        return;
      }
      setIsGraphFound(false);
      // If the graph is not found in local storage, create a new graph
      // dispatch(newGraphCreatedAction(graphIdParam.toString()))
      // setTimeout(() => {
      //   dispatch(graphSlice.actions.resizingTriggered())
      // }, 50)
      // return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, graphIdParam?.toString(), JSON.stringify(getMostRecentSavedGraph()), JSON.stringify(cloudGraph)]);

  const styleEditorVisible = useAppSelector((state) => state.styleeditor.visible);

  return (
    <Shell padding={false}>
      <CommonHead title="Edit Graph (V1)" />
      <NoSSRWrapper>
        {(session.status != 'loading' && cloudGraphQuery.status != 'loading') || session.status == 'unauthenticated' ? (
          <>
            {isGraphFound ? (
              <div className="h-screen pt-12 md:p-0 flex flex-col md:overflow-hidden">
                {isNotMobile ? (
                  <>
                    <GraphMetadata />
                    <div className="flex-grow flex h-full md:overflow-hidden">
                      <ResizableTab triggerResize={() => handleTriggerResize(dispatch)}>
                        <div className="flex w-full flex-col items-start h-full md:overflow-scroll scrollbar-hide">
                          <TextEditor />
                          <Alert />

                          {styleEditorVisible && (
                            <div className="absolute w-full h-1/2 bottom-0">
                              <VerticalResizable triggerResize={() => {}}>
                                <StyleEditor />
                              </VerticalResizable>
                            </div>
                          )}
                        </div>
                      </ResizableTab>
                      <div className="exported w-full">
                        <Graph />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col w-full h-full">
                    <GraphMetadata />
                    <MobileTabSwitcher
                      handleTabChange={(tab) => {
                        setTimeout(() => {
                          dispatch(graphSlice.actions.resizingTriggered());
                        }, 50);
                        setShouldTextEditorShow(tab == 'text');
                        if (tab == 'text') posthog.capture('switched to text editor in mobile');
                        if (tab == 'graph') posthog.capture('switched to graph editor in mobile');
                      }}
                    />
                    {shouldTextEditorShow && <TextEditor />}
                    <div className={classNames('w-full h-[60vh]', shouldTextEditorShow && 'invisible z-[-5] absolute opacity-0')}>
                      <Graph />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>No graph was found</div>
            )}
          </>
        ) : (
          <div className="p-3 space-y-2 pt-14 md:pt-3">
            <Spinner />
            {session.status == 'loading' && <div>Loading session...</div>}
            {session.status != 'loading' && cloudGraphQuery.status == 'loading' && <div>Loading graph...</div>}
          </div>
        )}
      </NoSSRWrapper>
    </Shell>
  );
};

export function getMostRecentSavedGraph(): GraphDataSchemaType | null {
  // This code is executed on the client side only
  if (typeof window == 'undefined') return null;
  const AllLocalStorageItems = getAllLocalStorageGraphs();
  if (!AllLocalStorageItems || AllLocalStorageItems.length == 0) return null;
  const lastGraphId = AllLocalStorageItems.reduce((prev, curr) => {
    const prevDateString = prev[1].graphmetadata?.date;
    const currDateString = curr[1].graphmetadata?.date;

    const prevDate = dayjs(prevDateString);
    const currDate = dayjs(currDateString);

    if (GraphDataSchema.safeParse(curr[1]).success && !GraphDataSchema.safeParse(prev[1]).success) {
      return curr;
    }
    if (!prevDateString) {
      return curr;
    }
    if (currDate.diff(prevDate) > 0) {
      return curr;
    } else {
      return prev;
    }
  });
  const result = GraphDataSchema.safeParse(lastGraphId[1]);
  if (result.success) {
    return lastGraphId[1];
  }
  return null;
}

function handleTriggerResize(dispatch: AppDispatch) {
  dispatch(graphSlice.actions.resizingTriggered());
}

export default Edit;
