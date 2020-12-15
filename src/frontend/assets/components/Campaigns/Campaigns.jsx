import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { actions } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';
import { getActiveCampaignCharacters } from '@assets/party/selectors';
import { getId, getName } from '@assets/character/calcs';

export function Campaigns({ campaigns }) {
  const { dispatch, state } = useContext(PartyContext);

  const handleDelete = (campaignId) => () => {
    dispatch(actions.deleteCampaign(campaignId));
  };

  const handleSetActiveCampaign = (campaignId) => () => {
    dispatch(actions.setActiveCampaign(campaignId));
  };

  const activeCampaignCharacters = getActiveCampaignCharacters(state);

  return (
    <>
      <ol>
        {Object.entries(campaigns).map(([campaignId]) => (
          <li key={campaignId}>
            <button onClick={handleSetActiveCampaign(campaignId)} type="button">{campaignId}</button>
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

Campaigns.propTypes = {
  campaigns: PropTypes.shape({}).isRequired,
};

export default Campaigns;
