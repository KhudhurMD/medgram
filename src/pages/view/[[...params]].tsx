import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Spinner } from '../../components/elements/Spinner';
import { Shell } from '../../components/layouts/Shell';
import Graph from '../../components/modules/editor/Graph';
import { graphSlice } from '../../components/modules/editor/Graph/slice';
import VisualEditorWithProvider from '../../components/modules/vizeditor';
import NoSSRWrapper from '../../components/utility/NoSSRWrapper';
import { loadGraphAction } from '../../store/store';
import { useAppDispatch } from '../../store/storeHooks';
import { api } from '../../utils/api';

export const ViewPage = () => {
  const router = useRouter();
  const routerQuery = router.query;
  const dispatch = useAppDispatch();
  const linkId = routerQuery.params?.toString();
  const [isGraphFound, setIsGraphFound] = React.useState(true);
  const [loadedGraph, setLoadedGraph] = React.useState();

  const cloudGraph = api.graphlink.getGraphView.useQuery(
    { id: linkId! },
    {
      enabled: linkId != undefined,
    }
  ).data?.graph;

  console.log(cloudGraph?.graphData);

  const isV2 = cloudGraph?.editorVersion === 'v2';
  const v2Nodes = JSON.parse(cloudGraph?.graphData || '{}').graphv2?.nodes;
  const v2Edges = JSON.parse(cloudGraph?.graphData || '{}').graphv2?.edges;

  useEffect(() => {
    if (!router.isReady) return;

    if (linkId && cloudGraph) {
      dispatch(loadGraphAction(JSON.parse(cloudGraph.graphData || '{}')));
      const cloudGraphData = JSON.parse(cloudGraph.graphData || '{}');
      cloudGraphData.graphmetadata.shouldSave = false;
      setLoadedGraph(cloudGraphData);
      setIsGraphFound(true);
      setTimeout(() => {
        dispatch(graphSlice.actions.resizingTriggered());
      }, 50);
      dispatch(graphSlice.actions.disableEditing());
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, linkId?.toString(), JSON.stringify(cloudGraph)]);
  return (
    <Shell>
      <NoSSRWrapper>
        {!isV2 && (
          <>
            {isGraphFound && loadedGraph ? (
              <div className="flex h-screen flex-row">
                <Graph />
              </div>
            ) : (
              <div className="p-3 space-y-2">
                <Spinner />
                <p>Loading...</p>
              </div>
            )}
          </>
        )}
        {isV2 && v2Nodes && v2Edges && (
          <div className="flex h-screen flex-row">
            <VisualEditorWithProvider initialNodes={v2Nodes} initialEdges={v2Edges} viewOnly={true} />
          </div>
        )}
      </NoSSRWrapper>
    </Shell>
  );
};

export default ViewPage;
