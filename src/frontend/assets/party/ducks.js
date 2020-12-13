import { getId } from '@assets/character/calcs';
import { getCampaignId } from '@assets/character/selectors';
import { getCampaign } from './selectors';

// increment this when the state structure changes to force update stored values
const schemaVersion = 1;
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
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.IMPORT_CHARACTER: {
      const { character } = action;
      const { campaigns } = state;
      const campaignId = getCampaignId(character);
      const campaign = getCampaign(state, campaignId);
      return {
        ...state,
        campaigns: {
          ...campaigns,
          [campaignId]: {
            ...campaign,
            [getId(character)]: character,
          },
        },
      };
    }
    case ActionTypes.IMPORT_CHARACTERS: {
      const { characters } = action;
      let { campaigns } = state;
      // add each character into their campaign
      characters.forEach((character) => {
        const campaignId = getCampaignId(character);
        campaigns = {
          ...campaigns,
          [campaignId]: {
            // make sure we use the campaigns data we're building on, not from the stale state
            ...campaigns[campaignId],
            [getId(character)]: character,
          },
        };
      });
      return {
        ...state,
        campaigns,
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
