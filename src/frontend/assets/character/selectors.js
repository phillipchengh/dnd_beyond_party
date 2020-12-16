/**
 * Add test data into selectors_expected_values.js to generate tests!!
 */

export function getCampaignId(character) {
  return character.campaign?.id ?? 0;
}

export function getCampaignName(character) {
  return character.campaign?.name ?? 'Solo Adventurers';
}

export function getCampaignMembers(character) {
  return character.campaign?.characters ?? [];
}

export function getCampaignMembersIds(character) {
  return getCampaignMembers(character).map((member) => (member.characterId));
}
