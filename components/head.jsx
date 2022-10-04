import NextHead from 'next/head';
import NextScript from 'next/script';

export default function Head({ instructions, svgText }) {
  return (
    <>
      <NextHead>
        <title>SVG Path Editor</title>
        <meta
          name='description'
          content='Interactive tool to edit an SVG by editing the path commands that describe its shape'
        />
        <link
          rel='icon'
          href={`data:image/svg+xml,${encodeURIComponent(svgText)}`}
        />

        <style>
          {instructions
            .map(
              (_, i) =>
                `
                .highlight-${i} {
                  display: none;
                }

                .main:has(.command-${i}:focus-within) .highlight-${i},
                .main:has(.command-${i}:hover) .highlight-${i} {
                  display: inline;
                }
          `
            )
            .join('')}
        </style>
      </NextHead>
      {/* Fathom - simple website analytics */}
      {process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <NextScript>
          {`(function(f, a, t, h, o, m){
            a[h]=a[h]||function(){
              (a[h].q=a[h].q||[]).push(arguments)
            };
            o=f.createElement('script'),
            m=f.getElementsByTagName('script')[0];
            o.async=1; o.src=t; o.id='fathom-script';
            m.parentNode.insertBefore(o,m)
          })(document, window, '//fathom-rfauver.herokuapp.com/tracker.js', 'fathom');
          fathom('set', 'siteId', 'RBTTM');
          fathom('trackPageview');`}
        </NextScript>
      )}
      {/* / Fathom */}
    </>
  );
}