import { CommonHead } from '@/src/components/elements/CommonHead';
import { Navbar } from '@/src/components/layouts/Navbar';
import { Button } from '@/src/components/ui/button';
import { serverApi } from '@/src/utils/serverapi';
import { CaretLeft, Spinner } from '@phosphor-icons/react';
import { PublicGraph } from '@prisma/client';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export const AlgorithmPage = ({ graph }: { graph: PublicGraph }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const title = graph.title;
  const description = 'Medgram is a free, small and ever-growing library of medical algorithms';
  const canonicalPrefix = `/algorithm/${graph.slug}`;

  return (
    <>
      <Navbar />
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://medgram.net${canonicalPrefix}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`https://medgram.net/graphs/${graph.imageUrl}`} />
        <meta property="og:url" content={`https://medgram.net/graphs/${graph.slug}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mt-6" />
        <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={14} weight="bold" />
          <p>All algorithms</p>
        </Link>
        <div className="mt-4" />
        <div className="flex justify-between items-center">
          <h3 className="text-3xl font-semibold tracking-[-0.20px]">{graph.title}</h3>
          <div className="flex gap-2 mt-4">
            <Link href={`/graphs/${graph.imageUrl}`} passHref target="_blank">
              <Button variant="outline">Download</Button>
            </Link>
          </div>
        </div>

        <div className="mt-8" />
        <div className="border border-gray-200 p-1 rounded-2xl">
          <Image
            src={`/graphs/${graph.imageUrl}`}
            alt={graph.title}
            width={2000}
            height={1000}
            data-loaded="false"
            onLoad={(event) => {
              event.currentTarget.setAttribute('data-loaded', 'true');
              setImageLoading(false);
            }}
            className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-50 data-[loaded=true]:bg-white rounded-lg"
          />
        </div>

        <div className="mt-8" />
      </div>
    </>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const graphSlug = context.params?.params?.[0];

  if (!graphSlug) {
    return {
      notFound: true,
    };
  }

  const graph = await serverApi.publicGraphs.getBySlug.fetch({ slug: graphSlug });

  return {
    props: {
      graph: JSON.parse(JSON.stringify(graph)) as PublicGraph,
    },
  };
};

export const getStaticPaths = async () => {
  const slugs = await serverApi.publicGraphs.getAllSlugs.fetch();
  const slugsArray = slugs.map((slug) => slug.slug);
  console.log('slugs', slugsArray);

  return {
    paths: slugsArray.map((slug) => ({ params: { params: [slug] } })),
    fallback: false,
  };
};

export default AlgorithmPage;
