import React, { useContext } from 'react';

import PartyContext from '@assets/party/Context';
import {
  getCampaigns,
} from '@assets/party/selectors';

import Campaign from './Campaign';

export function Campaigns() {
  const { state } = useContext(PartyContext);

  const campaigns = getCampaigns(state);

  return (
    <>
      <h2>Campaigns</h2>
      <ol role="menu">
        {Object.keys(campaigns).map((campaignId) => (
          <li role="menuitem" key={campaignId}>
            <Campaign campaignId={campaignId} />
          </li>
        ))}
      </ol>
    </>
  );
}

export default Campaigns;
