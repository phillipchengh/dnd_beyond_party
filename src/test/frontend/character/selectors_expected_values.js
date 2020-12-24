// this file maps character/selectors.js to their expected values in the json

import BISMUTH from './dnd_beyond_character_json/28364322.json';
import GARUDA from './dnd_beyond_character_json/28364554.json';
import SUKU from './dnd_beyond_character_json/24118073.json';

export default [
  {
    character: BISMUTH.data,
    // add values here to generate tests!!
    expectedValues: {
      // key is a selector in character/selectors.js
      // value is the expected value in the json
      getCampaignId: 1106078,
      getCampaignName: 'Scrub\'s World',
      getCampaignMembersIds: [
        28364322,
        28364554,
        28398380,
        28433810,
        29925598,
        32377709,
      ],
      getOtherCampaignMembersIds: [
        28364554,
        28398380,
        28433810,
        29925598,
        32377709,
      ],
      isActiveInOwnCampaign: true,
      isSoloAdventurer: false,
      getLink: 'https://dndbeyond.com/characters/28364322',
    },
  },
  {
    character: GARUDA.data,
    expectedValues: {
      getCampaignId: 1106078,
    },
  },
  {
    character: SUKU.data,
    expectedValues: {
      getCampaignId: 0,
      // default name for no assigned campaign
      getCampaignName: 'Solo Adventurers',
      getCampaignMembers: [],
      getCampaignMembersIds: [],
      getOtherCampaignMembersIds: [],
      isActiveInOwnCampaign: true,
      isSoloAdventurer: true,
    },
  },
];
