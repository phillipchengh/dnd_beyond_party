import getCharacter from '@assets/api';
import {
  getCampaignId,
  getOtherCampaignMembersIds,
  isActiveInCampaign,
  isInCampaign,
  isSoloAdventurer,
} from '@assets/character/selectors';
import { actions } from './ducks';
import {
  getCurrentCampaignId,
  getCampaignMembersIds,
  getUnimportedCampaignCharacters,
} from './selectors';

export async function importCampaign({ dispatch }, character) {
  // if solo adventurer, just add them to the campaign
  if (isSoloAdventurer(character)) {
    dispatch(actions.importCharacter(character));
    return;
  }
  const characters = [];
  const campaignId = getCampaignId(character);
  if (isActiveInCampaign(character, campaignId)) {
    characters.push(character);
  }
  // we're importing from a specific and fresh character, trust the campaign data in it
  // trust as in just get the characters listed under the character's campaign
  // updateCampaign below handles character transactions with a lot more nuance
  const otherCharacterIds = getOtherCampaignMembersIds(character);
  await Promise.all(otherCharacterIds.map(async (characterId) => {
    const otherCharacter = await getCharacter(characterId);
    // at least check if they're active
    if (isActiveInCampaign(otherCharacter, campaignId)) {
      characters.push(otherCharacter);
    }
    // updateCampaign would also check for newly assigned characters
    // however, character data is probably fresh, so skip that
  }));
  if (characters.length) {
    dispatch(actions.updateCampaign(campaignId, characters));
  }
  // TODO if no characters, we need to bubble an error message or something
}

export async function updateCampaign({ dispatch, state }, campaignId) {
  // access the current campaign id only here, in case state changes while this is going on
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
}

export async function updateCurrentCampaign({ dispatch, state }) {
  const campaignId = getCurrentCampaignId(state);
  updateCampaign({ dispatch, state }, campaignId);
}