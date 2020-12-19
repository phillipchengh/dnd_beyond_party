import React, { useState } from 'react';
import PropTypes from 'prop-types';

export function ImportCharacter({ onSubmit }) {
  const [ddbCharacterId, setDdbCharacterId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSubmit(ddbCharacterId);
  };

  const handleChange = (event) => {
    setDdbCharacterId(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        placeholder="D&D Beyond Character ID"
        type="text"
      />
      <button type="submit">Import</button>
    </form>
  );
}

ImportCharacter.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ImportCharacter;
