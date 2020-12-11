import React from 'react';
import PropTypes from 'prop-types';

import { getName } from '@assets/character/calcs';

export function Campaigns({ campaigns }) {
  return (
    <ol>
      {Object.entries(campaigns).map(([campaignId, campaign]) => (
        <li key={campaignId}>
          {campaignId}
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
