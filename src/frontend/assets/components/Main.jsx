import React, { useContext } from 'react';

import PartyContext from '@assets/party/Context';

import ImportWizard from './ImportWizard/ImportWizard';
import Campaigns from './Campaigns/Campaigns';

export function Main() {
  const { state } = useContext(PartyContext);

  return (
    <main>
      <h1>D&D Beyond Party</h1>
      <ImportWizard />
      <Campaigns campaigns={state.campaigns} />
    </main>
  );
}

export default Main;
