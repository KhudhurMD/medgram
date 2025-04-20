import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Trash } from '@phosphor-icons/react';
import { api } from '../../../utils/api';
import { getCookie } from '../../../utils/cookies';
import { Shell } from '../../layouts/Shell';
import { PreviewGraphProvider } from '../editor/ExportDialog/components/PreviewGraph';

export const GraphsV2 = () => {
  const userId = useSession().data?.user?.id;
  const anonymousId = getCookie('anonymous_id');
  const graphsQuery = api.graph.getUserGraphs.useQuery({
    anonymousId: userId ? undefined : anonymousId,
    editorVersion: 'v2',
  });

  const graphs = graphsQuery.data;
  const deleteGraph = api.graph.deleteGraph.useMutation({
    onSuccess: () => graphsQuery.refetch(),
  });

  return (
    <div className="flex flex-wrap rounded-lg pb-0 mb-8">
      {graphsQuery.status === 'success' && graphs?.length === 0 && <p className="text-gray-500">No graphs found</p>}
      {graphs?.map((graph) => {
        return (
          <div className="w-full md:w-1/2" key={graph.id}>
            <div className="md:mr-6 mb-6 bg-white flex flex-row justify-between overflow-hidden rounded-lg border border-gray-200 pl-6 shadow-sm">
              <div className="mr-4 flex flex-col justify-between py-4">
                <div>
                  <p className="text-gray-500">{`Updated ${dayjs(graph.updatedAt).toNow()}`}</p>
                  <h2 className="text-xl text-gray-700">
                    <Link href={`/edit/${graph.id}`}>{graph.name}</Link>
                  </h2>
                </div>
                <div className="flex flex-row items-center">
                  <div className=""></div>
                  <div className="">
                    <button
                      className="mr-2 flex items-center gap-1 rounded-lg border border-gray-200 p-2 px-4 text-gray-600"
                      onClick={() => deleteGraph.mutate({ id: graph.id, anonymousId: userId ? undefined : anonymousId })}
                    >
                      <Trash className="text-gray-400" size={22} />
                      <p>Delete</p>
                    </button>
                  </div>
                </div>
              </div>
              <div className='item-center relative h-48 w-48 border-l border-gray-200 after:absolute after:top-0 after:left-0 after:z-10 after:h-full after:w-full after:content-[""]'>
                <PreviewGraphProvider
                  parsedNodes={JSON.parse(graph.graphData).graphv2.nodes}
                  parsedEdges={JSON.parse(graph.graphData).graphv2.edges}
                  shouldLayout={false}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
