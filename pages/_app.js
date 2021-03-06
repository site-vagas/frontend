import '../styles/globals.css'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as gtag from './../lib/gtag';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    }
  }, [router.events])

  return (
    <>
      <Head>
        <meta name="referrer" content="origin"/>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
