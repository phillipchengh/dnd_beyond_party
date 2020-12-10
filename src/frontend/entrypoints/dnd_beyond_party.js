import React from 'react';
import ReactDOM from 'react-dom';
import { getCLS, getFID, getLCP } from 'web-vitals';

import App from '@assets/components/App';

// eslint-disable-next-line no-console
const consoleLog = console.log;

getCLS(consoleLog);
getFID(consoleLog);
getLCP(consoleLog);

ReactDOM.render(<App />, document.getElementById('dnd_beyond_party_app'));
