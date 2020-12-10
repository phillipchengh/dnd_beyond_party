import React, { useReducer } from 'react';

import partyReducer, { initialState } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';

import Main from './Main';

export function DndBeyondPartyApp() {
  const [state, dispatch] = useReducer(partyReducer, initialState);

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
