import { GetServerSidePropsContext, NextPage } from 'next';
import { Shell } from '../components/layouts/Shell';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Plus } from '@phosphor-icons/react';
import { Button } from '../components/elements/Button';
import { GraphsV2 } from '../components/modules/graphs/GraphsV2';
import GraphsV1 from '../components/modules/graphs/GraphsV1';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { deleteCookie, getCookie } from '../utils/cookies';
import { api } from '../utils/api';
import { CommonHead } from '../components/elements/CommonHead';
import { getServerAuthSession } from '../server/auth';

dayjs.extend(relativeTime);

export const GraphsPage: NextPage = () => {
  const tabs = ['Version 2', 'Version 1'];
  const [tabIndex, setTabIndex] = useState(0);
  const session = useSession();
  const sessionData = session.data;
  const sessionLoading = session.status === 'loading';
  const transferGraphsToUser = api.graph.transferAnonymousGraphsToUser.useMutation();

  const push = useRouter().push;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const anonymousId = getCookie('anonymous_id');

    if (sessionLoading || !sessionData) return;

    if (anonymousId) {
      transferGraphsToUser.mutate({ anonymousId });
      deleteCookie('anonymous_id');
    }
  }, [sessionData, transferGraphsToUser, sessionLoading]);

  return (
    <Shell
      overflow='scroll'
    >
      <CommonHead title="My Graphs" />
      <div className="p-4">
        <div className="flex mb-7 justify-between items-center">
          <h1 className="text-2xl text-gray-700">My Graphs</h1>
          <Button label="New Graph" icon={<Plus size={18} />} className="h-fit" size="sm" variant="secondary" onClick={() => push('/edit/new')} />
        </div>
        <div className="flex space-x-2 mb-4">
          {tabs.map((tab, index) => (
            <Button
              key={index}
              label={tab}
              size="sm"
              variant="secondary"
              className={`h-fit ${tabIndex === index ? 'bg-primary-100 text-primary-600' : 'bg-gray-50 text-gray-600'}`}
              onClick={() => setTabIndex(index)}
            />
          ))}
        </div>
        {tabIndex === 0 && <GraphsV2 />}
        {tabIndex === 1 && <GraphsV1 />}
      </div>
    </Shell>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);
  const userId = session?.user?.id;
  if (!userId) {
    return {
      redirect: {
        destination: '/auth/signin?redirect=/graphs',
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
};

export default GraphsPage;
