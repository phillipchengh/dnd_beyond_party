import React, { useContext, useState } from 'react';

import getCharacter from '@assets/api';
import { actions } from '@assets/party/ducks';
import { getUnimportedCampaignCharacters } from '@assets/party/selectors';
import PartyContext from '@assets/party/Context';

import ImportCharacter from './ImportCharacter';
import ImportCharactersConfirm from './ImportCharactersConfirm';

export function ImportWizard() {
  const { dispatch, state } = useContext(PartyContext);
  const [campaignMembersToImport, setCampaignMembersToImport] = useState([]);

  const handleCharacterImport = async (ddbCharacterId) => {
    const character = await getCharacter(ddbCharacterId);
    dispatch(actions.importCharacter(character));
    const unimportedCharacters = getUnimportedCampaignCharacters(state, character);
    if (unimportedCharacters.length) {
      setCampaignMembersToImport(unimportedCharacters);
    }
  };

  const handleCharactersImport = async () => {
    const characters = [];
    await Promise.all(campaignMembersToImport.map(async ({ characterId }) => {
      const character = await getCharacter(characterId);
      characters.push(character);
    }));
    dispatch(actions.importCharacters(characters));
    setCampaignMembersToImport([]);
  };

  return (
    <>
      {!campaignMembersToImport.length && <ImportCharacter onSubmit={handleCharacterImport} />}
      {!!campaignMembersToImport.length && (
        <ImportCharactersConfirm
          characters={campaignMembersToImport}
          onConfirm={handleCharactersImport}
        />
      )}
    </>
  );
}

export default ImportWizard;
