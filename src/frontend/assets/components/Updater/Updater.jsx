import React, { useContext } from 'react';

import PartyContext from '@assets/party/Context';
import getCharacter from '@assets/api';
import { actions } from '@assets/party/ducks';
import { isActiveInCampaign, isInCampaign } from '@assets/character/selectors';
import {
  getCurrentCampaignId,
  getCampaignMembersIds,
  getUnimportedCampaignCharacters,
} from '@assets/party/selectors';

export function Updater() {
  const { dispatch, state } = useContext(PartyContext);

  const handleUpdate = async () => {
    // access the current campaign id only here, in case state changes while this is going on
    const campaignId = getCurrentCampaignId(state);
    const characterIds = getCampaignMembersIds(state, campaignId);
    const characters = [];
    const newCharacterIdsToRequest = new Set();
    // source campaign data from each character to clarify what the party should be now
    // characters can be added/dropped/moved
    // added characters haven't been requested yet
    // dropped chararacters can still refer to the campaign, but are unlisted in campaign.characters
    // moved characters can refer to a new or no campaign
    await Promise.all(characterIds.map(async (characterId) => {
      const character = await getCharacter(characterId);
      // filter out newly unassigned/moved/dropped chararacters, just lose them forever
      if (isActiveInCampaign(character, campaignId)) {
        characters.push(character);
      }
      // if they're still in the campaign, whether unassigned or active, they'll have campaign data
      // a crazy scenario is all original characters are now unassigned
      if (isInCampaign(character, campaignId)) {
        // gather newly assigned characters we don't have any data on
        getUnimportedCampaignCharacters(state, character).forEach(({
          characterId: newCharacterId,
        }) => {
          newCharacterIdsToRequest.add(newCharacterId);
        });
      }
    }));
    await Promise.all(Array.from(newCharacterIdsToRequest).map(async (characterId) => {
      const character = await getCharacter(characterId);
      characters.push(character);
    }));
    // if the campaign has got no more active characters, delete it
    if (!characters.length) {
      dispatch(actions.deleteCampaign(campaignId));
    } else {
      dispatch(actions.updateCampaign(campaignId, characters));
    }
  };

  return (
    <button onClick={handleUpdate} type="button">Update Current Campaign</button>
  );
}

export default Updater;
