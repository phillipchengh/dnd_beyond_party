import React, { useContext } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { actions } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';
import { getCurrentCampaignCharacters, getCampaigns } from '@assets/party/selectors';
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
  const currentCampaignCharacters = getCurrentCampaignCharacters(state);

  return (
    <>
      <ol>
        {Object.entries(campaigns).map(([campaignId, { lastUpdate, name }]) => (
          <li key={campaignId}>
            <button onClick={handleSetCurrentCampaign(campaignId)} type="button">
              {`${campaignId}: ${name}`}
            </button>
            <button onClick={handleDelete(campaignId)} type="button">Delete</button>
            <span>{`Last Update: ${formatDistanceToNow(lastUpdate)}`}</span>
          </li>
        ))}
      </ol>
      <ol>
        {currentCampaignCharacters.map(({ lastUpdate, data }) => (
          <li key={getId(data)}>
            {`${getId(data)}: ${getName(data)}`}
            <br />
            {`Last Update: ${formatDistanceToNow(lastUpdate)}`}
          </li>
        ))}
      </ol>
    </>
  );
}

export default Campaigns;
