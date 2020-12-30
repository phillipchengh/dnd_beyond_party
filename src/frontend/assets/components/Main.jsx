import React, { useContext, useState } from 'react';

import PartyContext from '@assets/party/Context';
import { hasCampaigns } from '@assets/party/selectors';

import Updater from './Updater/Updater';
import Campaigns from './Campaigns/Campaigns';

export function Main() {
  const { state } = useContext(PartyContext);

  return (
    <main>
      <center>
        <h1>D&D Beyond Party</h1>
      </center>
      <Updater />
      <Campaigns campaigns={state.campaigns} />
    </main>
  );
}

export default Main;
