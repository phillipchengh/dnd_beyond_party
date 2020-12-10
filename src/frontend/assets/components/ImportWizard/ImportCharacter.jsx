import React, { useContext, useState } from 'react';

import getCharacter from '@assets/api';
import { actions } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';

export function ImportCharacter() {
  const { dispatch } = useContext(PartyContext);
  const [ddbCharacterId, setDdbCharacterId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const character = await getCharacter(ddbCharacterId);
    dispatch(actions.importCharacter(character));
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
    </form>
  );
}

export default ImportCharacter;
