import Head from 'next/head';
import { useRouter } from 'next/router';

export const CommonHead = ({ title = 'Medgram' }: { title?: string }) => {
  const router = useRouter();
  const canonicalPrefix = router.pathname === '/' ? '' : router.pathname;
  const description = 'Medgram is a free ever-growing library of medical algorithms.';
  return (
    <Head>
      <title>{title}</title>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="apple-mobile-web-app-title" content="Medgram" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="application-name" content="Medgram" />
      <meta name="msapplication-TileColor" content="#603cba" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <link rel="canonical" href={`https://medgram.net${canonicalPrefix}`} />
    </Head>
  );
};
