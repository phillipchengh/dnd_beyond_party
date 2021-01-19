import React, { useReducer } from 'react';

import partyReducer, { initialState } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';
import * as calcs from '@assets/character/calcs';
import * as selectors from '@assets/party/selectors';

import '@assets/reset.less';

import Main from './Main';

export function DndBeyondPartyApp() {
  const [state, dispatch] = useReducer(partyReducer, initialState);

  // for debugging calcs and selectors from the console
  // TODO either remove this when done or read an environment value
  window.state = state;
  window.calcs = calcs;
  window.selectors = selectors;

  return (
    <PartyContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <Main />
    </PartyContext.Provider>
  );
}

export default DndBeyondPartyApp;
