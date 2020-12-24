import React from 'react';
import PropTypes from 'prop-types';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { getId, getName } from '@assets/character/calcs';
import {
  areSoloAdventurers,
  formatCampaignCharacters,
  isEmptyCampaign,
} from '@assets/party/utilities';

export function ImportedCampaignInfo({
  campaign,
  isExistingCampaign,
}) {
  if (isEmptyCampaign(campaign)) {
    return (
      <div>
        {'We found no active characters in the imported character\'s campaign. Please try another character.'}
      </div>
    );
  }
  const {
    id, characters, lastUpdate, name,
  } = campaign;
  let title;
  if (areSoloAdventurers(campaign)) {
    title = 'We added your character to Solo Adventurers!';
  } else if (isExistingCampaign) {
    title = `We imported characters to ${name}!`;
  } else {
    title = `We found and imported ${name}!`;
  }
  return (
    <>
      <h3>{title}</h3>
      <dl>
        <dt>Campaign ID</dt>
        <dd>{id}</dd>
        <dt>Last Update</dt>
        <dd>{formatDistanceToNow(lastUpdate)}</dd>
      </dl>
      <ol>
        {formatCampaignCharacters(characters).map(({ data }) => (
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

ImportedCampaignInfo.propTypes = {
  campaign: PropTypes.shape({
    characters: PropTypes.shape({}).isRequired,
    id: PropTypes.number.isRequired,
    lastUpdate: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  isExistingCampaign: PropTypes.bool.isRequired,
};

export default ImportedCampaignInfo;
