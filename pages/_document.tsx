/* eslint-disable @next/next/no-title-in-document-head */
import Document, { Html, Main, Head, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* HTML Meta Tags*/}
          <meta
            name="description"
            content="Chronicle is a unique NFT studio & marketplace connecting the world’s best icons & brands with fans, in accessible, rewarding & eco-friendly ways."
          />

          <meta property="type" content="website" />
          <meta property="title" content="Chronicle" />
          <meta property="quote" content="" />
          <meta
            property="image"
            content="https://xnl-platform.s3.us-west-1.amazonaws.com/logo400x400.jpg"
          />

          {/* Facebook Meta Tags */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Chronicle" />
          <meta
            name="og:description"
            content="Chronicle is a unique NFT studio & marketplace connecting the world’s best icons & brands with fans, in accessible, rewarding & eco-friendly ways."
          />

          <meta property="og:locale" content="en_US" />
          <meta property="og:quote" content="" />

          {/* Twitter Meta Tags */}
          <meta name="twitter:card" content="summary" />
          <meta
            property="twitter:url"
            content={`${process.env.NEXT_PUBLIC_DOMAIN}/store`}
          />
          <meta name="twitter:title" content="Chronicle" />
          <meta
            name="twitter:description"
            content="Chronicle is a unique NFT studio & marketplace connecting the world’s best icons & brands with fans, in accessible, rewarding & eco-friendly ways."
          />
          <meta
            name="twitter:image"
            content="https://xnl-platform.s3.us-west-1.amazonaws.com/logo400x400.jpg"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Staatliches&display=swap"
            rel="stylesheet"
          />
        </Head>

        <body>
          <Main />
          <div id="portal" />
          <NextScript />
        </body>
      </Html>
    );
  }
}
