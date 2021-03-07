import React, { useContext } from 'react';

import PartyContext from '@assets/party/Context';
import {
  getSortedCampaignIds,
} from '@assets/party/selectors';

import Campaign from './Campaign';

export function Campaigns() {
  const { state } = useContext(PartyContext);

  return (
    <ol role="menu">
      {getSortedCampaignIds(state).map((campaignId) => (
        <li role="menuitem" key={campaignId}>
          <Campaign campaignId={campaignId} />
        </li>
      ))}
    </ol>
  );
}

export default Campaigns;
