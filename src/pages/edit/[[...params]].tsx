import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react';
import { Shell } from '../../components/layouts/Shell';
import NoSSRWrapper from '../../components/utility/NoSSRWrapper';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { api, RouterOutputs } from '../../utils/api';
import { getServerAuthSession } from '../../server/auth';
import { graphV2Slice } from '../../components/modules/vizeditor/slice';
import { serverApiAuth } from '../../utils/serverapi';
import { getCookie } from '../../utils/cookies';
import { useSession } from 'next-auth/react';
import { StarterEdges, StarterNodes } from '../../components/modules/vizeditor/constants';
import { useDebounce } from 'usehooks-ts';
import { Edge, Node } from 'reactflow';
import { v4 } from 'uuid';
import { graphMetadataSlice } from '../../components/modules/editor/GraphMetadata/slice';
import VisualEditorWithProvider from '../../components/modules/vizeditor';
import { CommonHead } from '../../components/elements/CommonHead';

type GraphType = RouterOutputs['graph']['getGraph'];
export const Edit = ({ graph, graphId }: { graph?: GraphType; graphId: string }) => {
  const saveGraph = api.graph.updateGraph.useMutation();
  const id = graphId;
  const dispatch = useAppDispatch();

  const userId = useSession().data?.user?.id;

  const graphName = useAppSelector((state) => state.graphmetadata.name);
  const graphState = useAppSelector((state) => state);

  const [nodes, setNodes] = useState([] as Node[]);
  const [edges, setEdges] = useState([] as Edge[]);

  const debouncedGraphState = useDebounce(graphState, 500);

  useEffect(() => {
    const anonymousId = getCookie('anonymous_id');
    const isContentEmpty = graphState.graphv2.nodes?.length === 0;
    if (isContentEmpty) return;

    const a = JSON.stringify(graphState.graphv2?.nodes.map((node) => node.data));
    const b = JSON.stringify(StarterNodes.map((node) => node.data));

    if (a === b) {
      return;
    }

    saveGraph.mutate({
      id,
      graphData: JSON.stringify(graphState),
      name: graphName,
      userId,
      anonymousId: userId ? undefined : (anonymousId as string),
      editorVersion: 'v2',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedGraphState]);

  useEffect(() => {
    window.history.pushState({}, '', `/edit/${graphId}`);
  }, [graphId]);

  useEffect(() => {
    const localGraphPresent = graphState.graphv2.nodes?.length > 0 && graphState.graphmetadata.id === graphId;
    const remoteGraphPresent = JSON.parse(graph?.graphData ?? '[]').graphv2?.nodes?.length > 0;

    // If local graph is present and ids match, use local graph
    if (localGraphPresent) {
      setNodes(graphState.graphv2.nodes);
      setEdges(graphState.graphv2.edges);
    }

    // If remote graph is present and local graph is not present, use remote graph
    if (remoteGraphPresent && !localGraphPresent) {
      setNodes(JSON.parse(graph?.graphData ?? '[]').graphv2.nodes);
      setEdges(JSON.parse(graph?.graphData ?? '[]').graphv2.edges);
      dispatch(graphV2Slice.actions.setGraph({ nodes, edges }));
      dispatch(
        graphMetadataSlice.actions.graphMetadataChanged({
          id: graphId,
          date: JSON.parse(graph?.graphData ?? '{}').graphmetadata?.date ?? new Date().toISOString(),
          author: JSON.parse(graph?.graphData ?? '{}').graphmetadata?.author ?? '',
          name: graph?.name ?? 'Untitled',
        })
      );
    }

    // If neither local nor remote graph is present, use starter graph
    if (!localGraphPresent && !remoteGraphPresent) {
      setNodes(StarterNodes);
      setEdges(StarterEdges);
      dispatch(graphV2Slice.actions.setGraph({ nodes: StarterNodes, edges: StarterEdges }));
      dispatch(
        graphMetadataSlice.actions.graphMetadataChanged({
          id: graphId,
          date: new Date().toISOString(),
          author: '',
          name: 'Untitled',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, graphId]);

  return (
    <>
      <CommonHead title="Edit Graph" />
      <Shell padding={false}>
        <NoSSRWrapper>
          <VisualEditorWithProvider initialNodes={nodes} initialEdges={edges} />
        </NoSSRWrapper>
      </Shell>
    </>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);
  const anonymousId = context.req.cookies['anonymous_id'];
  const graphId = context.params?.params?.[0] as string;
  const authApi = serverApiAuth(session);

  const shouldGenerateNewGraph = graphId === 'new';
  const shouldGetLatestGraph = !graphId || graphId === '';

  if (shouldGenerateNewGraph) {
    return {
      props: {
        graphId: v4(),
      },
    };
  }

  if (shouldGetLatestGraph) {
    const latestGraph =
      shouldGetLatestGraph &&
      (await authApi.graph.getLastGraph.fetch({
        anonymousId: session ? undefined : anonymousId,
      }));

    if (!latestGraph) {
      return {
        props: {
          graphId: v4(),
        },
      };
    }

    return {
      props: {
        graph: JSON.parse(JSON.stringify(latestGraph)),
        graphId: latestGraph?.id,
      },
    };
  }

  const graphById = await authApi.graph.getGraph.fetch({
    id: graphId,
    anonymousId: session ? undefined : anonymousId,
  });

  return {
    props: {
      graph: JSON.parse(JSON.stringify(graphById)),
      graphId,
    },
  };
};

export default Edit;
