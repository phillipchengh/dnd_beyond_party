import lzutf8 from 'lzutf8';
import { getId } from '@assets/character/calcs';
import { getCampaignId, getCampaignInfo } from '@assets/character/selectors';
import { getCampaignCharacters } from './selectors';
import { getEmptyCampaign } from './utilities';

// increment this when the state structure changes to force update stored values
const schemaVersion = 9;
// campaign data is compressed and stored under the campaigns key
// everything else is uncompressed and stored under the party key
const LOCAL_STORAGE_KEY = 'party';
const LOCAL_STORAGE_CAMPAIGNS = 'campaigns';

function getInitialState() {
  try {
    const localStorageState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if our versions match, use the cached data
    if (parseInt(localStorageState?.schemaVersion, 10) === schemaVersion) {
      // campaigns is stored specially compressed under the campaigns key
      const campaigns = JSON.parse(lzutf8.decompress(localStorage.getItem(LOCAL_STORAGE_CAMPAIGNS), { inputEncoding: 'BinaryString' }));
      // our state schema should look like one object like the empty case below
      return {
        ...localStorageState,
        campaigns,
      };
    }
  } catch (e) {
    // guess this could happen if parse fails?
  }
  // empty case, start anew
  return {
    currentCampaignId: null,
    campaigns: {},
    error: null,
    schemaVersion,
  };
}

export const initialState = getInitialState();

export const ActionTypes = {
  IMPORT_CHARACTER: 'import_character',
  DELETE_CAMPAIGN: 'delete_campaign',
  UPDATE_CAMPAIGN: 'update_campaign',
  SET_CURRENT_CAMPAIGN_ID: 'set_current_campaign_id',
  DELETE_CURRENT_CAMPAIGN: 'delete_current_campaign',
  SET_ERROR: 'set_error',
  CLEAR_ERROR: 'clear_error',
};

// specially wrap action with storeCampaigns to store updated campaigns changes to localStorage
const storeCampaigns = (action) => ({
  ...action,
  storeCampaigns: true,
});

export const actions = {
  importCharacter: (character) => (storeCampaigns({
    type: ActionTypes.IMPORT_CHARACTER,
    character,
  })),
  deleteCampaign: (campaignId) => (storeCampaigns({
    type: ActionTypes.DELETE_CAMPAIGN,
    campaignId,
  })),
  updateCampaign: (campaignId, characters) => (storeCampaigns({
    type: ActionTypes.UPDATE_CAMPAIGN,
    campaignId,
    characters,
  })),
  setCurrentCampaign: (campaignId) => ({
    type: ActionTypes.SET_CURRENT_CAMPAIGN_ID,
    campaignId,
  }),
  deleteCurrentCampaign: () => (storeCampaigns({
    type: ActionTypes.DELETE_CURRENT_CAMPAIGN,
  })),
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
      // always update campaign with latest campaign info
      const campaignInfo = getCampaignInfo(character);
      // merge with any existing campaign characters
      const campaignCharacters = getCampaignCharacters(state, campaignId);
      const lastUpdate = new Date().getTime();
      return {
        ...state,
        error: null,
        campaigns: {
          ...campaigns,
          [campaignId]: {
            ...campaignInfo,
            lastUpdate,
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
        // always update campaign with latest campaign info
        const campaignInfo = getCampaignInfo(character);
        return {
          ...next,
          ...campaignInfo,
          lastUpdate,
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
    case ActionTypes.DELETE_CURRENT_CAMPAIGN: {
      const { currentCampaignId } = state;
      const nextState = {
        error: null,
        ...state,
      };
      delete nextState.campaigns[currentCampaignId];
      return nextState;
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
      // make a copy of state to not mess with base reducer logic
      const localStorageState = { ...nextState };
      // separate out campaigns data to store that specially
      const { campaigns } = localStorageState;
      delete localStorageState.campaigns;
      // if storing campaigns changes, compress that in the background to avoid hogging main thread
      // compressing is an expensive operation, so we want to avoid it as much as possible
      // action.storeCampaigns is specially set by the storeCampaigns function above
      if (action.storeCampaigns) {
        // campaigns data
        localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS, lzutf8.compress(JSON.stringify(campaigns), { outputEncoding: 'BinaryString' }));
        // everything else in party state
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localStorageState));
      } else {
        // if not storing any new campaigns, just store everything else in party state
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localStorageState));
      }
      return nextState;
    } catch (e) {
      // localStorage.setItem can hit a browser storage quota
      const errorState = wrappedReducer(state, actions.setError(LOCAL_STORAGE_ERROR));
      return errorState;
    }
  }
);

// default export will use localStorage
export default withLocalStorage(reducer);
