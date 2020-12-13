import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { actions } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';
import { getName } from '@assets/character/calcs';

export function Campaigns({ campaigns }) {
  const { dispatch } = useContext(PartyContext);

  const handleDelete = (campaignId) => () => {
    dispatch(actions.deleteCampaign(campaignId));
  };

  return (
    <ol>
      {Object.entries(campaigns).map(([campaignId, campaign]) => (
        <li key={campaignId}>
          {campaignId}
          <button onClick={handleDelete(campaignId)} type="button">Delete</button>
          {Object.entries(campaign).map(([characterId, character]) => (
            <div key={characterId}>
              {`${characterId}: ${getName(character)}`}
            </div>
          ))}
        </li>
      ))}
    </ol>
  );
}

Campaigns.propTypes = {
  campaigns: PropTypes.shape({}).isRequired,
};

export default Campaigns;
