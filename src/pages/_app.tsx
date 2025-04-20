import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { api } from '../utils/api';

import { GoogleAnalytics } from '@next/third-parties/google';

import '../styles/globals.css';
import '../styles/custom.css';
import '../styles/vizeditor.css';
import '../styles/texteditor.css';
import '../styles/graph.css';

import { Provider } from 'react-redux';

import 'reactflow/dist/style.css';

import { store } from '../store/store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import React from 'react';
import { ErrorBoundary } from '@sentry/nextjs';
import { ErrorFallback } from '../components/utility/ErrorFallback';
import { getCookie, setCookie } from '../utils/cookies';
import { v4 } from 'uuid';

// eslint-disable-next-line
const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const router = useRouter();

  useEffect(() => {
    if (!window) return;
    const toolbarJSON = new URLSearchParams(window.location.hash.substring(1)).get('__posthog');
    if (toolbarJSON) {
      posthog.loadToolbar(JSON.parse(toolbarJSON));
    }
    const anonymousId = getCookie('anonymous_id');
    const sessionCookie = getCookie('session');
    if (!anonymousId && !sessionCookie) {
      setCookie('anonymous_id', v4());
    }
  }, []);

  useEffect(() => {
    posthog.init('phc_8oPy3L3XtZBBgPQw1KJ9omZugBZrX2ZofZlnMo0YqwB', { api_host: 'https://ax.medgram.net', opt_in_site_apps: true });
  }, []);

  useEffect(() => {
    const editRoute = router.pathname.includes('edit');

    if (!editRoute) return;

    if (typeof window !== 'undefined') {
      document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
        // @ts-ignore
        document.body.style.zoom = 1;
      });
      document.addEventListener('gesturechange', function (e) {
        e.preventDefault();
        // @ts-ignore
        document.body.style.zoom = 1;
      });
      document.addEventListener('gestureend', function (e) {
        e.preventDefault();
        // @ts-ignore
        document.body.style.zoom = 1;
      });
    }
  }, [router.pathname]);

  return (
    <>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <SessionProvider session={session}>
          <Provider store={store}>
            <Component {...pageProps} key={router.asPath} />
          </Provider>
        </SessionProvider>
      </ErrorBoundary>
      <GoogleAnalytics gaId="G-6MECLLK8BX" />
    </>
  );
};

export default api.withTRPC(MyApp);
