import Head from "next/head";

export type MetaProps = {
  title?: string;
  image?: string;
  description?: string;
  url?: string;
};

export const Meta = ({ title, image, description, url }: MetaProps) => {
  const currentUrl = url || `${process.env.NEXT_PUBLIC_DOMAIN}/store`;
  const ntitle = title || "Chronicle";
  const nimage =
    image || "https://xnl-platform.s3.us-west-1.amazonaws.com/logo400x400.jpg";

  const ndescription =
    description ||
    "Chronicle is a unique NFT studio & marketplace connecting the world’s best icons & brands with fans, in accessible, rewarding & eco-friendly ways.";

  return (
    <Head>
      {/* HTML Meta Tags*/}
      <title>{ntitle}</title>
      <meta name="description" content={ndescription} />
      <meta property="type" content="website" />
      <meta property="title" content={ntitle} />
      <meta property="image" content={nimage} />

      {/* Facebook Meta Tags */}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ntitle} />
      <meta name="og:description" content={ndescription} />
      <meta property="og:image" content={nimage} />
      <meta property="og:image:alt" content="alt" />
      <meta property="og:image:secure_url" content={nimage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="600" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary" />
      <meta property="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={ntitle} />
      <meta name="twitter:description" content={ndescription} />
      <meta name="twitter:image" content={nimage} />
    </Head>
  );
};
