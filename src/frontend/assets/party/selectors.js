import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { characterSelectors as char } from '@assets/character/characterSelectors';
import {
  getEmptyCampaign,
  formatCampaignCharacters,
  isImportedCampaign,
} from './utilities';

export function hasCampaigns(state) {
  return !!Object.keys(state.campaigns).length;
}

export function getCampaigns(state) {
  return state.campaigns;
}

export function getSortedCampaignIds(state) {
  // eslint-disable-next-line no-unused-vars
  return Object.entries(getCampaigns(state)).sort(([idA, campaignA], [idB, campaignB]) => (
    campaignA.name.localeCompare(campaignB.name)
  )).map(([campaignId]) => (parseInt(campaignId, 10)));
}

export function getCampaign(state, campaignId) {
  // either retrieve the existing campaign, or return a new campaign object
  return state.campaigns[campaignId] ?? getEmptyCampaign();
}

export function getCampaignName(state, campaignId) {
  return getCampaign(state, campaignId).name;
}

export function getCampaignLastUpdate(state, campaignId) {
  return formatDistanceToNow(getCampaign(state, campaignId).lastUpdate);
}

export function getCampaignLink(state, campaignId) {
  const path = getCampaign(state, campaignId).link;
  return path ? `https://www.dndbeyond.com${path}` : null;
}

export function getCampaignCharacters(state, campaignId) {
  return getCampaign(state, campaignId).characters ?? {};
}

export function getSortedCampaignCharacters(state, campaignId) {
  return formatCampaignCharacters(getCampaignCharacters(state, campaignId));
}

export function getCurrentCampaign(state) {
  return getCampaign(state, state.currentCampaignId);
}

export function hasCurrentCampaign(state) {
  return isImportedCampaign(getCurrentCampaign(state));
}

export function getCurrentCampaignName(state) {
  return getCurrentCampaign(state).name;
}

export function getCurrentCampaignLastUpdate(state) {
  return getCurrentCampaign(state).lastUpdate;
}

export function getCurrentCampaignId(state) {
  return state.currentCampaignId;
}

export function getCurrentCampaignLink(state) {
  return getCampaignLink(state, state.currentCampaignId);
}

export function getSortedCurrentCampaignCharacters(state) {
  return getSortedCampaignCharacters(state, state.currentCampaignId);
}

export function getCampaignMembersIds(state, campaignId) {
  return Object.keys(getCampaignCharacters(state, campaignId)).map((id) => parseInt(id, 10));
  // return getCampaignCharacters(state, campaignId).map(({ data: { id } }) => parseInt(id, 10));
}

export function getUnimportedCampaignCharacters(state, character) {
  // get who's already in our store (usually the character we just imported)
  const importedCampaignMemberIds = getCampaignMembersIds(state, char.getCampaignId(character));
  // filter out our already imported characters in the list in the character we just got
  return char.getCampaignMembers(character).filter(({ characterId }) => (
    !importedCampaignMemberIds.includes(characterId)
  ));
}

export function getError(state) {
  return state.error;
}

export function getCharacter(state, characterId) {
  return Object.values(getCampaigns(state)).reduce((
    allCharacters, { characters },
  ) => (
    allCharacters.concat(Object.values(characters))
  ), []).find(({ data: { id } }) => (id === characterId))?.data ?? null;
}
