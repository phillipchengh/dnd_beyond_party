export function getCampaign(state, campaignId) {
  return state.campaigns[campaignId] || {};
}

export default getCampaign;
