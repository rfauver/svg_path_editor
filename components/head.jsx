import NextHead from 'next/head';
import NextScript from 'next/script';
import getConfig from 'next/config';

export default function Head({ instructions, svgText }) {
  const { publicRuntimeConfig } = getConfig();
  return (
    <>
      <NextHead>
        <title>SVG Path Editor</title>
        <meta
          name='description'
          content='Interactive tool to edit an SVG by editing the path commands that describe its shape'
        />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
        />
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link
          rel='icon'
          type='image/svg+xml'
          href={`data:image/svg+xml,${encodeURIComponent(svgText)}`}
        />
      </NextHead>
      {/* Fathom - simple website analytics */}
      {process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' &&
        publicRuntimeConfig.fathomDomain &&
        publicRuntimeConfig.fathomId && (
          <NextScript>
            {`(function(f, a, t, h, o, m){
              a[h]=a[h]||function(){
                (a[h].q=a[h].q||[]).push(arguments)
              };
              o=f.createElement('script'),
              m=f.getElementsByTagName('script')[0];
              o.async=1; o.src=t; o.id='fathom-script';
              m.parentNode.insertBefore(o,m)
            })(document, window, '${publicRuntimeConfig.fathomDomain}', 'fathom');
            fathom('set', 'siteId', '${publicRuntimeConfig.fathomId}');
            fathom('trackPageview');`}
          </NextScript>
        )}
      {/* / Fathom */}
    </>
  );
}
