import React, { useContext } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { actions } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';
import {
  getCampaigns,
  getCurrentCampaignName,
  getSortedCurrentCampaignCharacters,
  hasCurrentCampaign,
} from '@assets/party/selectors';
import {
  getClassDisplay,
  getId,
  getName,
} from '@assets/character/calcs';

export function Campaigns() {
  const { dispatch, state } = useContext(PartyContext);

  const handleDelete = (campaignId) => () => {
    dispatch(actions.deleteCampaign(campaignId));
  };

  const handleSetCurrentCampaign = (campaignId) => () => {
    dispatch(actions.setCurrentCampaign(campaignId));
  };

  const campaigns = getCampaigns(state);
  const showCurrentCampaign = hasCurrentCampaign(state);
  let currentCampaignName;
  let currentCampaignCharacters;
  if (showCurrentCampaign) {
    currentCampaignName = getCurrentCampaignName(state);
    currentCampaignCharacters = getSortedCurrentCampaignCharacters(state);
  }

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
      {showCurrentCampaign && (
        <>
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
                  <dt>Class</dt>
                  <dd>{getClassDisplay(data)}</dd>
                </dl>
              </li>
            ))}
          </ol>
        </>
      )}
    </>
  );
}

export default Campaigns;
