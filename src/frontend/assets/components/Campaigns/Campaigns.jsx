import React, { useContext } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { actions } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';
import {
  getCampaigns,
  getCurrentCampaignName,
  getCurrentCampaignCharacters,
} from '@assets/party/selectors';
import { getId, getName } from '@assets/character/calcs';

export function Campaigns() {
  const { dispatch, state } = useContext(PartyContext);

  const handleDelete = (campaignId) => () => {
    dispatch(actions.deleteCampaign(campaignId));
  };

  const handleSetCurrentCampaign = (campaignId) => () => {
    dispatch(actions.setCurrentCampaign(campaignId));
  };

  const campaigns = getCampaigns(state);
  const currentCampaignName = getCurrentCampaignName(state);
  const currentCampaignCharacters = getCurrentCampaignCharacters(state);

  return (
    <>
      <h2>Campaigns</h2>
      <ol>
        {Object.entries(campaigns).map(([campaignId, { lastUpdate, name }]) => (
          <li key={campaignId}>
            <div><strong>{name}</strong></div>
            <button onClick={handleSetCurrentCampaign(campaignId)} type="button">
              View
            </button>
            <button onClick={handleDelete(campaignId)} type="button">Delete</button>
            <dl>
              <dt>Campaign ID</dt>
              <dd>{campaignId}</dd>
              <dt>Last Update</dt>
              <dd>{formatDistanceToNow(lastUpdate)}</dd>
            </dl>
          </li>
        ))}
      </ol>
      <h2>{`Current Campaign: ${currentCampaignName}`}</h2>
      <ol>
        {currentCampaignCharacters.map(({ lastUpdate, data }) => (
          <li key={getId(data)}>
            <div><strong>{getName(data)}</strong></div>
            <dl>
              <dt>Character ID</dt>
              <dd>{getId(data)}</dd>
              <dt>Last Update</dt>
              <dd>{formatDistanceToNow(lastUpdate)}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </>
  );
}

export default Campaigns;
