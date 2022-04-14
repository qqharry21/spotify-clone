/** @format */

import { DefaultSeo } from 'next-seo';
import Head from 'next/head';
import { url } from '../lib/utils/url';

const Meta = ({ title, keywords, description }) => {
  return (
    <>
      <Head>
        <meta name='keywords' content={keywords} />
        {/* Spotify icons created by Pixel perfect - Flaticon */}
        <link rel='icon' href='/spotify.png' />
      </Head>
      <DefaultSeo
        defaultTitle={title}
        titleTemplate='%s | Spotify'
        openGraph={{
          type: 'website',
          locale: 'zh_TW',
          url: url,
          description: description,
          site_name: title,
          images: [],
        }}
        canonical={url}
      />
    </>
  );
};

Meta.defaultProps = {
  title: 'Hao | Spotify',
  keywords: 'web development, programming, web design, react js, tailwindcss, next js, clone',
  description: "Spotify's web development blog",
};

export default Meta;
