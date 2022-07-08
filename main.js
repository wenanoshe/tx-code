'use strict';

import Split from 'split-grid';
import { encode, decode } from 'js-base64';

import './style.css';

/*
  ====== VARIABLES =====
*/

const $iframe = document.getElementById('iframe');
const $html = document.getElementById('html');
const $css = document.getElementById('css');
const $js = document.getElementById('js');


/*
  ====== FUNCTIONS =====
*/

const initCode = () => {
  let pathname = window.location.pathname;
  const [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C');

  let innerCode = {
    html : decode(rawHtml),
    css : decode(rawCss),
    js : decode(rawJs)
  }

  $html.value = innerCode.html;
  $css.value = innerCode.css;
  $js.value = innerCode.js;

  const code = createHtml(innerCode);
  $iframe.setAttribute('srcdoc', code);
}


const update = () => {
  const html = $html.value;
  const css = $css.value;
  const js = $js.value;

  // encoding the code pased to the textareas
  const rawCode = `${encode(html)}|${encode(css)}|${encode(js)}`;

  // passing baseCode to the url
  history.replaceState(null, null, rawCode);

  const code = createHtml({html, css, js});
  $iframe.setAttribute('srcdoc', code);
}

const createHtml = ({html, css, js}) => {

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Tx Code</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>
    ${js}
    </script>
  </body>
</html>
  `
}


/*
  ====== CODE EXECUTION =====
*/

initCode();

$html.addEventListener('input', (e) => update());
$css.addEventListener('input', (e) => update());
$js.addEventListener('input', (e) => update());

/* Split js */

Split({
    columnGutters: [{
    track: 1,
    element: document.querySelector('.vertical-gutter'),
  }],
  rowGutters: [{
  	track: 1,
    element: document.querySelector('.horizontal-gutter'),
  }]
})

