import { getId } from '@assets/character/calcs';
import { getCampaignId, getCampaignName } from '@assets/character/selectors';
import { getCampaign, getCampaignCharacters } from './selectors';

// increment this when the state structure changes to force update stored values
const schemaVersion = 5;
const LOCAL_STORAGE_KEY = 'party';

function getInitialState() {
  try {
    const localStorageState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if our versions match, use the cached data
    if (parseInt(localStorageState?.meta?.schemaVersion, 10) === schemaVersion) {
      return localStorageState;
    }
  } catch (e) {
    // guess this could happen if parse fails?
  }
  // empty case, start anew
  return {
    currentCampaignId: null,
    campaigns: {},
    meta: {
      schemaVersion,
    },
  };
}

export const initialState = getInitialState();

export const ActionTypes = {
  IMPORT_CHARACTER: 'import_character',
  IMPORT_CHARACTERS: 'import_characters',
  DELETE_CAMPAIGN: 'delete_campaign',
  UPDATE_CAMPAIGN: 'update_campaign',
  SET_CURRENT_CAMPAIGN_ID: 'set_current_campaign_id',
};

export const actions = {
  importCharacter: (character) => ({
    type: ActionTypes.IMPORT_CHARACTER,
    character,
  }),
  importCharacters: (characters) => ({
    type: ActionTypes.IMPORT_CHARACTERS,
    characters,
  }),
  deleteCampaign: (campaignId) => ({
    type: ActionTypes.DELETE_CAMPAIGN,
    campaignId,
  }),
  updateCampaign: (campaignId, characters) => ({
    type: ActionTypes.UPDATE_CAMPAIGN,
    campaignId,
    characters,
  }),
  setCurrentCampaign: (campaignId) => ({
    type: ActionTypes.SET_CURRENT_CAMPAIGN_ID,
    campaignId,
  }),
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.IMPORT_CHARACTER: {
      const { character } = action;
      const { campaigns } = state;
      const campaignId = getCampaignId(character);
      const campaignName = getCampaignName(character);
      // will create or retrieve existing campaign
      const campaign = getCampaign(state, campaignId);
      const campaignCharacters = getCampaignCharacters(state, campaignId);
      const lastUpdate = new Date().getTime();
      return {
        ...state,
        currentCampaignId: campaignId,
        campaigns: {
          ...campaigns,
          [campaignId]: {
            ...campaign,
            lastUpdate,
            // update the campaign name with latest known name
            name: campaignName,
            characters: {
              // add this character among existing campaign characters
              ...campaignCharacters,
              [getId(character)]: {
                lastUpdate,
                data: character,
              },
            },
          },
        },
      };
    }
    case ActionTypes.IMPORT_CHARACTERS: {
      const { characters } = action;
      let { campaigns } = state;
      let campaignId;
      // add each character into their campaign
      characters.forEach((character) => {
        campaignId = getCampaignId(character);
        const campaignName = getCampaignName(character);
        // make sure we use the campaigns data we're building on, not from the stale state
        const campaign = campaigns[campaignId];
        const campaignCharacters = campaign.characters;
        const lastUpdate = new Date().getTime();
        campaigns = {
          ...campaigns,
          [campaignId]: {
            ...campaign,
            lastUpdate,
            name: campaignName,
            characters: {
              ...campaignCharacters,
              [getId(character)]: {
                lastUpdate,
                data: character,
              },
            },
          },
        };
      });
      return {
        ...state,
        // default select last character's campaign
        currentCampaignId: campaignId,
        campaigns,
      };
    }
    case ActionTypes.DELETE_CAMPAIGN: {
      // make a copy of state and delete the copy's campaign
      const { campaignId } = action;
      const nextState = { ...state };
      delete nextState.campaigns[campaignId];
      return nextState;
    }
    case ActionTypes.UPDATE_CAMPAIGN: {
      const { campaignId, characters } = action;
      const { campaigns } = state;
      const campaign = getCampaign(state, campaignId);
      const updatedCampaign = characters.reduce((next, character) => {
        const lastUpdate = new Date().getTime();
        const campaignName = getCampaignName(character);
        return {
          ...next,
          lastUpdate,
          name: campaignName,
          characters: {
            ...next.characters,
            [getId(character)]: {
              lastUpdate,
              data: character,
            },
          },
        };
      }, {
        // clear out old character data, action.characters will have all the updated data
        ...campaign,
        characters: {},
      });
      return {
        ...state,
        campaigns: {
          ...campaigns,
          [campaignId]: updatedCampaign,
        },
      };
    }
    case ActionTypes.SET_CURRENT_CAMPAIGN_ID: {
      const { campaignId } = action;
      return {
        ...state,
        // json keys are strings, so let's cast it to a number as a value
        // i.e. when we compare campaign ids, we should compare them as numbers
        currentCampaignId: parseInt(campaignId, 10),
      };
    }
    default:
      throw new Error('No action type specified!');
  }
}

// this will save state to localStorage, so if the page is revisited, initialState can get it
const withLocalStorage = (wrappedReducer) => (
  (state, action) => {
    const nextState = wrappedReducer(state, action);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextState));
    return nextState;
  }
);

// default export will use localStorage
export default withLocalStorage(reducer);
