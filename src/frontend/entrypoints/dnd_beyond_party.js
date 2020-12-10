// https://babeljs.io/docs/en/babel-polyfill
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { getCLS, getFID, getLCP } from 'web-vitals';

import App from '@assets/components/App';

// eslint-disable-next-line no-console
const consoleLog = console.log;

getCLS(consoleLog);
getFID(consoleLog);
getLCP(consoleLog);

ReactDOM.render(<StrictMode><App /></StrictMode>, document.getElementById('dnd_beyond_party_app'));
