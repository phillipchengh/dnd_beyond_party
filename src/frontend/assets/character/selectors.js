export function getCampaignId(character) {
  return character.campaign?.id || 0;
}

export default getCampaignId;
