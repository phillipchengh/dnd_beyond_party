import { getId } from '@assets/character/calcs';
import { getCampaignId, getCampaignName } from '@assets/character/selectors';
import { getCampaign, getCampaignCharacters } from './selectors';
import { getEmptyCampaign } from './utilities';

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
    error: null,
    meta: {
      schemaVersion,
    },
  };
}

export const initialState = getInitialState();

export const ActionTypes = {
  IMPORT_CHARACTER: 'import_character',
  DELETE_CAMPAIGN: 'delete_campaign',
  UPDATE_CAMPAIGN: 'update_campaign',
  SET_CURRENT_CAMPAIGN_ID: 'set_current_campaign_id',
  SET_ERROR: 'set_error',
  CLEAR_ERROR: 'clear_error',
};

export const actions = {
  importCharacter: (character) => ({
    type: ActionTypes.IMPORT_CHARACTER,
    character,
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
  setError: (error) => ({
    type: ActionTypes.SET_ERROR,
    error,
  }),
  clearError: () => ({
    type: ActionTypes.CLEAR_ERROR,
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
        error: null,
        campaigns: {
          ...campaigns,
          [campaignId]: {
            ...campaign,
            campaignId,
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
    case ActionTypes.DELETE_CAMPAIGN: {
      // make a copy of state and delete the copy's campaign
      const { campaignId } = action;
      const nextState = {
        error: null,
        ...state,
      };
      delete nextState.campaigns[campaignId];
      return nextState;
    }
    case ActionTypes.UPDATE_CAMPAIGN: {
      const { campaignId, characters } = action;
      const { campaigns } = state;
      const updatedCampaign = characters.reduce((next, character) => {
        const lastUpdate = new Date().getTime();
        const campaignName = getCampaignName(character);
        return {
          ...next,
          campaignId,
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
      }, getEmptyCampaign());
      return {
        ...state,
        error: null,
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
    case ActionTypes.SET_ERROR: {
      const { error } = action;
      return {
        ...state,
        error,
      };
    }
    case ActionTypes.CLEAR_ERROR: {
      return {
        ...state,
        error: null,
      };
    }
    default:
      throw new Error('No action type specified!');
  }
}

const LOCAL_STORAGE_ERROR = 'Sorry, we could not save to your browser\'s local storage. Try removing some campaigns if it\'s full, or confirming your browser can store data.';

// this will save state to localStorage, so if the page is revisited, initialState can get it
const withLocalStorage = (wrappedReducer) => (
  (state, action) => {
    const nextState = wrappedReducer(state, action);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    } catch (e) {
      const errorState = wrappedReducer(state, actions.setError(LOCAL_STORAGE_ERROR));
      return errorState;
    }
  }
);

// default export will use localStorage
export default withLocalStorage(reducer);
