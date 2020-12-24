/**
 * Add test data into selectors_expected_values.js to generate tests!!
 */

import { getId } from './calcs';

export function getCampaignId(character) {
  return character.campaign?.id ?? 0;
}

export function getCampaignName(character) {
  return character.campaign?.name ?? 'Solo Adventurers';
}

export function getCampaignMembers(character) {
  return character.campaign?.characters ?? [];
}

// get what's in character.campaigns, except the list of characters
// party ducks stores the entire character data in campaign.characters instead
export function getCampaignInfo(character) {
  const campaign = character.campaign ?? {};
  const campaignInfo = {
    ...campaign,
    // handle Solo Adventurers specially
    id: getCampaignId(character),
    name: getCampaignName(character),
  };
  delete campaignInfo.characters;
  return campaignInfo;
}

export function getCampaignMembersIds(character) {
  return getCampaignMembers(character).map((member) => (member.characterId));
}

export function getOtherCampaignMembersIds(character) {
  return getCampaignMembersIds(character).filter(
    (characterId) => (characterId !== getId(character)),
  );
}

export function isInCampaign(character, campaignId) {
  return getCampaignId(character) === campaignId;
}

// characters who don't have a campaign have campaign === null
export function isSoloAdventurer(character) {
  return isInCampaign(character, 0);
}

// this checks if they're active (rather than unassigned) in the campaign
// also verifies that the character hasn't moved out of campaignId
export function isActiveInCampaign(character, campaignId) {
  return (
    // ensure character is still in campaignId
    isInCampaign(character, campaignId) && (
      // ensure character is still active (not unassigned)
      // unassigned characters can still refer to their campaign
      // but campaign.characters won't list unassigned characters
      getCampaignMembersIds(character).includes(getId(character))
      // special case if checking solo adventurer
      // if not apart of a campaign, they can't be active
      // just check if they haven't moved into a real campaign (from above)
      || isSoloAdventurer(character)
    )
  );
}

// this is mainly to test isActiveInCampaign with only a character argument
export function isActiveInOwnCampaign(character) {
  return isActiveInCampaign(character, getCampaignId(character));
}
