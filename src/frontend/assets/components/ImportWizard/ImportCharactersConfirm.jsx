import React from 'react';
import PropTypes from 'prop-types';

export function ImportCharactersConfirm({ characters, onConfirm }) {
  return (
    <section>
      <h2>We will import these characters:</h2>
      <ul>
        {characters.map((character) => (
          <li key={character.characterId}>{`${character.characterId}: ${character.characterName}`}</li>
        ))}
      </ul>
      <button onClick={onConfirm} type="button">Confirm</button>
    </section>
  );
}

ImportCharactersConfirm.propTypes = {
  characters: PropTypes.arrayOf(PropTypes.shape({
    characterId: PropTypes.number.isRequired,
    characterName: PropTypes.string.isRequired,
  })).isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ImportCharactersConfirm;
