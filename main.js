'use strict';

import './style.css';

import Split from 'split-grid';
import { encode, decode } from 'js-base64';

import * as Monaco from 'monaco-editor';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import JsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

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

const update = () => {
  const html = htmlEditor.getValue();
  const css = cssEditor.getValue();
  const js = jsEditor.getValue();

  // encoding the code pased to the textareas
  const rawCode = `${encode(html)}|${encode(css)}|${encode(js)}`;

  // passing baseCode to the url
  history.replaceState(null, null, rawCode);

  const htmlForPreview = createHtml({html, css, js});
  $iframe.setAttribute('srcdoc', htmlForPreview);
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

let pathname = window.location.pathname;
let [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C');

rawCss === undefined ? rawCss = '' : rawCss
rawJs === undefined ? rawJs = '' : rawJs

const decodedCode = {
 html: decode(rawHtml),
 css : decode(rawCss),
 js : decode(rawJs),
}

const code = createHtml(decodedCode);

window.MonacoEnvironment = {
   getWorker: (_, label) => {
      switch (label) {
         case 'html':
            return new HtmlWorker()
         break;

         case 'css':
            return new CssWorker()
         break;

         case 'javascript':
            return new JsWorker()
         break;

      }
   }
}


const COMMON_EDITOR_OPTIONS = {
   automaticLayout: true,
   fontSize: 14,
   theme: 'vs-dark',
   padding: {
      top: 14
   },
   minimap: {
      enabled: false
   },

}

const htmlEditor = Monaco.editor.create($html, {
   value: decodedCode.html,
   language: 'html',
   ...COMMON_EDITOR_OPTIONS,
});


const cssEditor = Monaco.editor.create($css, {
   value: decodedCode.css,
   language: 'css',
   ...COMMON_EDITOR_OPTIONS,
});

const jsEditor = Monaco.editor.create($js, {
   value: decodedCode.js,
   language: 'javascript',
   ...COMMON_EDITOR_OPTIONS,
});

htmlEditor.onDidChangeModelContent(update);
cssEditor.onDidChangeModelContent(update);
jsEditor.onDidChangeModelContent(update);

update();

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

