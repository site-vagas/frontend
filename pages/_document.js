import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="pt-br">
        <Head>
            <meta name="content-type" content="text/html;chartset=utf-8" />
            <meta name="theme-color" content="#0288d1"/>
            <link rel="icon" href="/favicon.png" />
            <link rel="icon" sizes="192x192" href="/favicon.png" />

            {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
            <script data-ad-client={`${process.env.GOOGLE_ADSENSE_KEY}`} async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_KEY}`}></script>
            <script dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${process.env.GOOGLE_ANALYTICS_KEY}', {
                page_path: window.location.pathname
              });`}}/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument