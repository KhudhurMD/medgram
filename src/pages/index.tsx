import { PublicGraph } from '@prisma/client';
import { InferGetStaticPropsType } from 'next';
import { useSession } from 'next-auth/react';
import posthog from 'posthog-js';
import { useEffect } from 'react';
import { CommonHead } from '../components/elements/CommonHead';
import { Navbar } from '../components/layouts/Navbar';
import GraphsSection from '../components/modules/index/Graphs';
import { serverApi } from '../utils/serverapi';

export const IndexPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const sessionData = useSession();
  const userId = sessionData.data?.user?.id;
  const userEmail = sessionData.data?.user?.email;

  useEffect(() => {
    if (userId && !userEmail) {
      posthog.identify(userId, { Email: userEmail });
    }
    if (userId && userEmail) {
      posthog.identify(userId, { Email: userEmail });
    }
  }, [userId, userEmail]);

  return (
    <div className="pb-64">
      <CommonHead title="Medgram - Free Medical Algorithms Library" />
      <Navbar active="home" />
      <GraphsSection initialGraphs={props.initialGraphs} />
    </div>
  );
};

export const getStaticProps = async () => {
  const graphs = await serverApi.publicGraphs.getAll.fetch();

  return {
    props: {
      initialGraphs: JSON.parse(JSON.stringify(graphs)) as PublicGraph[],
    },
  };
};

export default IndexPage;
