import React, { useContext } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { actions } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';
import { getActiveCampaignCharacters, getCampaigns } from '@assets/party/selectors';
import { getId, getName } from '@assets/character/calcs';

export function Campaigns() {
  const { dispatch, state } = useContext(PartyContext);

  const handleDelete = (campaignId) => () => {
    dispatch(actions.deleteCampaign(campaignId));
  };

  const handleSetActiveCampaign = (campaignId) => () => {
    dispatch(actions.setActiveCampaign(campaignId));
  };

  const campaigns = getCampaigns(state);
  const activeCampaignCharacters = getActiveCampaignCharacters(state);

  return (
    <>
      <ol>
        {Object.entries(campaigns).map(([campaignId, { lastUpdate, name }]) => (
          <li key={campaignId}>
            <button onClick={handleSetActiveCampaign(campaignId)} type="button">
              {`${campaignId}: ${name}`}
            </button>
            <button onClick={handleDelete(campaignId)} type="button">Delete</button>
            <span>{`Last Update: ${formatDistanceToNow(lastUpdate)}`}</span>
          </li>
        ))}
      </ol>
      <ol>
        {activeCampaignCharacters.map(({ lastUpdate, data }) => (
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
