import { characterSelectors as char } from '@assets/character/characterSelectors';
import { getName } from '@assets/character/calcs';

export function hasCampaigns(state) {
  return !!Object.keys(state.campaigns).length;
}

export function getCampaigns(state) {
  return state.campaigns;
}

export function getCampaign(state, campaignId) {
  // either retrieve the existing campaign, or return a new campaign object
  return state.campaigns[campaignId] ?? {
    characters: {},
  };
}

export function getCampaignCharacters(state, campaignId) {
  return Object.entries(
    getCampaign(state, campaignId).characters,
  ).map(
    // just return an array of character objects
    // eslint complains about unused characterId
    // eslint-disable-next-line no-unused-vars
    ([characterId, character]) => (character),
  ).sort((a, b) => (
    // sort by character name
    getName(a.data).localeCompare(getName(b.data))
  ));
}

export function getCurrentCampaign(state) {
  return getCampaign(state, state.currentCampaignId);
}

export function getCurrentCampaignId(state) {
  return state.currentCampaignId;
}

export function getCurrentCampaignCharacters(state) {
  return getCampaignCharacters(state, state.currentCampaignId);
}

export function getCampaignMembersIds(state, campaignId) {
  return getCampaignCharacters(state, campaignId).map(({ data: { id } }) => parseInt(id, 10));
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
