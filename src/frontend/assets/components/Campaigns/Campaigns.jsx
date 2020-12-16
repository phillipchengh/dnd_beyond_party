import React, { useContext } from 'react';
import PropTypes from 'prop-types';

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
        {Object.entries(campaigns).map(([campaignId, { name }]) => (
          <li key={campaignId}>
            <button onClick={handleSetActiveCampaign(campaignId)} type="button">
              {`${campaignId}: ${name}`}
            </button>
            <button onClick={handleDelete(campaignId)} type="button">Delete</button>
          </li>
        ))}
      </ol>
      <ol>
        {activeCampaignCharacters.map((character) => (
          <li key={getId(character)}>
            {`${getId(character)}: ${getName(character)}`}
          </li>
        ))}
      </ol>
    </>
  );
}

export default Campaigns;
