import React from 'react';
import PropTypes from 'prop-types';

import { getName } from '@assets/character/calcs';
import { isSoloAdventurer } from '@assets/character/selectors';

export function FoundCharacterInfo({ character, error }) {
  const characterName = getName(character);
  return (
    <>
      <h2>{`We found ${characterName}!`}</h2>
      {isSoloAdventurer(character) && (
        <p>{`${characterName} has no campaign, we've added them to Solo Adventurers!`}</p>
      )}
      {error && (
        <p>{error}</p>
      )}
    </>
  );
}

FoundCharacterInfo.propTypes = {
  character: PropTypes.shape({}).isRequired,
  error: PropTypes.string,
};

FoundCharacterInfo.defaultProps = {
  error: null,
};

export default FoundCharacterInfo;
