import { characterSelectors as char } from '@assets/character/characterSelectors';
import { getName } from '@assets/character/calcs';

export function hasCampaigns(state) {
  return !!Object.keys(state.campaigns).length;
}

export function getCampaign(state, campaignId) {
  return state.campaigns[campaignId] ?? {};
}

export function getActiveCampaign(state) {
  return getCampaign(state, state.activeCampaignId);
}

export function getActiveCampaignCharacters(state) {
  return Object.entries(
    getActiveCampaign(state),
  ).map(
    // just return an array of character objects
    // eslint complains about unused characterId
    // eslint-disable-next-line no-unused-vars
    ([characterId, character]) => (character),
  ).sort((a, b) => (
    // sort by character name
    getName(a).localeCompare(getName(b))
  ));
}

export function getCampaignMembersIds(state, campaignId) {
  return Object.keys(getCampaign(state, campaignId)).map((id) => parseInt(id, 10));
}

export function getUnimportedCampaignCharacters(state, character) {
  // get who's already in our store (usually the character we just imported)
  const importedCampaignMemberIds = getCampaignMembersIds(state, char.getCampaignId(character));
  // filter out our already imported characters in the list in the character we just got
  return char.getCampaignMembers(character).filter(({ characterId }) => (
    !importedCampaignMemberIds.includes(characterId)
  ));
}

export default getCampaign;
