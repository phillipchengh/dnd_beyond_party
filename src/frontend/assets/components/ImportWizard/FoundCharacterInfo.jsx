import React from 'react';
import PropTypes from 'prop-types';

import { getName } from '@assets/character/calcs';
import { isSoloAdventurer } from '@assets/character/selectors';

export function FoundCharacterInfo({ character }) {
  const characterName = getName(character);
  return (
    <>
      <h2>{`We found ${characterName}!`}</h2>
      {isSoloAdventurer(character) && (
        <p>{`${characterName} has no campaign, we've added them to Solo Adventurers!`}</p>
      )}
    </>
  );
}

FoundCharacterInfo.propTypes = {
  character: PropTypes.shape({}).isRequired,
};

export default FoundCharacterInfo;
