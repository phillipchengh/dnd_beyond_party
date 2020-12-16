import { getId } from '@assets/character/calcs';
import { getCampaignId, getCampaignName } from '@assets/character/selectors';
import { getCampaign, getCampaignCharacters } from './selectors';

// increment this when the state structure changes to force update stored values
const schemaVersion = 3;
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
    activeCampaignId: null,
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
  SET_ACTIVE_CAMPAIGN_ID: 'set_active_campaign_id',
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
  setActiveCampaign: (campaignId) => ({
    type: ActionTypes.SET_ACTIVE_CAMPAIGN_ID,
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
      return {
        ...state,
        activeCampaignId: campaignId,
        campaigns: {
          ...campaigns,
          [campaignId]: {
            ...campaign,
            // update the campaign name with latest known name
            name: campaignName,
            characters: {
              // add this character among existing campaign characters
              ...campaignCharacters,
              [getId(character)]: character,
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
        campaigns = {
          ...campaigns,
          [campaignId]: {
            ...campaign,
            name: campaignName,
            characters: {
              ...campaignCharacters,
              [getId(character)]: character,
            },
          },
        };
      });
      return {
        ...state,
        // default select last character's campaign
        activeCampaignId: campaignId,
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
    case ActionTypes.SET_ACTIVE_CAMPAIGN_ID: {
      const { campaignId } = action;
      return {
        ...state,
        activeCampaignId: campaignId,
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
