import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { graphSlice } from '../../components/modules/editor/Graph/slice';
import { loadGraphAction } from '../../store/store';
import { useAppDispatch } from '../../store/storeHooks';
import { api } from '../../utils/api';
import { v4 } from 'uuid';
import { Shell } from '../../components/layouts/Shell';
import { getCookie } from '../../utils/cookies';

export const LinkPage = () => {
  const router = useRouter();
  const routerQuery = router.query;
  const dispatch = useAppDispatch();
  const linkId = routerQuery.params?.toString();
  const userId = useSession().data?.user?.id;

  const graphCopy = api.graphlink.getGraphCopy.useQuery(
    { id: linkId! },
    {
      enabled: linkId != undefined,
    }
  ).data?.graph;

  const saveGraph = api.graph.updateGraph.useMutation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!router.isReady) return;

    const anonymousId = getCookie('anonymous_id');

    if (linkId && graphCopy) {
      const cloudGraphData = JSON.parse(graphCopy.graphData || '{}');
      const newGraphId = v4();
      cloudGraphData.graphmetadata.id = newGraphId;

      if (graphCopy.editorVersion === 'v1') {
        dispatch(loadGraphAction(cloudGraphData));
        setTimeout(() => {
          dispatch(graphSlice.actions.resizingTriggered());
        }, 50);
        setTimeout(() => {
          router.push(`/v1/edit/${newGraphId}`);
        }, 1000);
      }

      if (graphCopy.editorVersion === 'v2') {
        saveGraph.mutate({
          id: newGraphId,
          graphData: JSON.stringify(cloudGraphData),
          name: cloudGraphData.graphmetadata.name,
          userId,
          editorVersion: 'v2',
          anonymousId: userId ? undefined : anonymousId,
        });

        setTimeout(() => {
          window.location.href = `/edit/${newGraphId}`;
        }, 2000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, linkId?.toString(), JSON.stringify(graphCopy)]);

  return (
    <Shell>
      <div className="p-3">Loading Graph...</div>
    </Shell>
  );
};

export default LinkPage;
