import { getName } from '@assets/character/calcs';

export function getEmptyCampaign() {
  return {
    characters: {},
  };
}

// a campaign that is considered imported and usable has at least 1 imported character
// null or {} could be checked here
export function isImportedCampaign(campaign) {
  return !!campaign?.characters && !!Object.keys(campaign.characters).length;
}

export function isEmptyCampaign(campaign) {
  return !isImportedCampaign(campaign);
}

export function areSoloAdventurers(campaign) {
  return campaign.campaignId === 0;
}

export function formatCampaignCharacters(characters) {
  return Object.entries(characters).map(
    // just return an array of character objects
    // eslint complains about unused characterId
    // eslint-disable-next-line no-unused-vars
    ([characterId, character]) => (character),
  ).sort((a, b) => (
    // sort by character name
    getName(a.data).localeCompare(getName(b.data))
  ));
}
