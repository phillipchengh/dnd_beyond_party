/**
 * Add test data into selectors_expected_values.js to generate tests!!
 */

export function getCampaignId(character) {
  return character.campaign?.id ?? 0;
}

export default getCampaignId;
