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
      getCampaignMembersIds: [
        28364322,
        28364554,
        28398380,
        28433810,
        29925598,
        32377709,
      ],
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
      getCampaignMembers: [],
      getCampaignMembersIds: [],
    },
  },
];