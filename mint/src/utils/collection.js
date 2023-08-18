import * as CryptoJS from 'crypto-js';

import { INSCRIPTION_CDN, RAW_CDN } from '../config/ordinals.js';

export const BITWELL_PRICE = 66666;

const CRYPTOJS_INSCRIPTION = 'fd5dd81af761cfd751a599327ccfa7415afa3a9da7c38c075de95c00c2bf34e8i0';
const JQUERY_INSCRIPTION = '773e4865bcf3084e6d6ee5d49136fb5f7071d4c050ec4aeeaeb9c6d24fea5fc1i0';
const LOGO_FONT = '483d576448a1134efbe0a5e83a7c7a44ad8b3e7a552771033dba9d07674aa145i0';

export function buildBitwellHtml(name, background, punk, wish, password, preview) {
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
          src: url('${preview ? RAW_CDN : '/content'}/${LOGO_FONT}') format('woff2');
        }
      </style>
    </head>
    <body style="margin: 0px;font-family:'Architects Daughter';">
      <iframe src="${preview ? INSCRIPTION_CDN : '/content'}/${background}" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:10"></iframe>
      <img src="${preview ? INSCRIPTION_CDN : '/content'}/${punk}" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:20;image-rendering:pixelated" />
      <div id="wish" style="text-shadow: black 0px 0px 5px;font-size:2rem;position:absolute;text-align:center;width:100%;height:auto;top:10;z-index:20;color:white;">
        ${password ? '' : wish}
      </div>
      ${password ? (`
        <div id="lock" style="display: flex; gap: 12px; justify-content: center; align-items: center;width:100%;height:fit-content;font-size:1rem;position:absolute;text-align:center; bottom:0px;top:10;z-index:20;color:white;padding:5px">
          <input type="text" id="password" placeholder="enter password..." />
          <button type="button" id="decrypt">Decrypt</button>
        </div>
      `): ''}
      <script type="module">
        for (const lib of ['${CRYPTOJS_INSCRIPTION}', '${JQUERY_INSCRIPTION}']) {
          const response = await fetch(\`${preview ? RAW_CDN : '/content'}/\${lib}\`);
          const script = document.createElement("script");
          script.innerHTML = await response.text();
          document.body.append(script);
        }
        $('body').click(() => $('#wish').show(0, () => setTimeout(() => $('#wish').fadeOut(3000), 5000)));
        $('#wish').fadeOut(3000);
        ${password ? (`
        const encryptedWish = '${CryptoJS.AES.encrypt(wish, password)}';
        $('#decrypt').click(() => {
          const bytes = CryptoJS.AES.decrypt(encryptedWish, $('#password').val());
          $('#wish').text(bytes.toString(CryptoJS.enc.Utf8));
          $('#lock').hide();
        });`) : ''}
      </script>
    </body>
  </html>`;
}
