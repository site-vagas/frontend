import '../styles/globals.css'
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
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
