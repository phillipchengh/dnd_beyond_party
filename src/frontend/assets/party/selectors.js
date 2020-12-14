import { characterSelectors as char } from '@assets/character/characterSelectors';

export function hasCampaigns(state) {
  return !!Object.keys(state.campaigns).length;
}

export function getCampaign(state, campaignId) {
  return state.campaigns[campaignId] ?? {};
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
