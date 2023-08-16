import { INSCRIPTION_CDN } from '../config/ordinals.js';

export const BITWELL_PRICE = 66666;

const JQUERY_INSCRIPTION = '773e4865bcf3084e6d6ee5d49136fb5f7071d4c050ec4aeeaeb9c6d24fea5fc1i0';
const LOGO_FONT = '483d576448a1134efbe0a5e83a7c7a44ad8b3e7a552771033dba9d07674aa145i0';

export function buildBitwellHtml(name, background, punk, wish, preview) {
  return `
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Bitwell ${name}</title>
      ${preview ? `<base href=${(typeof window !== "undefined") ? window.location : null}>` : ''}
      <style>
        @font-face {
          font-family: 'Architects Daughter';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url('${preview ? INSCRIPTION_CDN : '/content'}/${LOGO_FONT}') format('woff2');
        }
      </style>
    </head>
    <body style="margin: 0px;">
      <iframe src="${preview ? INSCRIPTION_CDN : '/content'}/${background}" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:10"></iframe>
      <img src="${preview ? INSCRIPTION_CDN : '/content'}/${punk}" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:20;image-rendering:pixelated" />
      <div id="wish" style="font-family:'Architects Daughter';font-size:1.5rem;position:absolute;text-align:center;width:100%;height:auto;top:10;z-index:20;color:white;">
        ${wish}
      </div>
      <div id="logo" style="font-family:'Architects Daughter';font-size:1.25rem;position:absolute;left:10;bottom:0;z-index:20;color:orange;">
        &#8383;itwell Punks
      </div>
      <script type="module">
        const JQUERY_INSCRIPTION = '${JQUERY_INSCRIPTION}';
        const jqueryResponse = await fetch(\`${preview ? INSCRIPTION_CDN : '/content'}/\${JQUERY_INSCRIPTION}\`);
        eval(await jqueryResponse.text());
        $('body').click(() => $('#wish').show(0, () => setTimeout(() => $('#wish').fadeOut(3000), 5000)));
        $('#wish').fadeOut(3000);
      </script>
    </body>
  </html>`;
}
