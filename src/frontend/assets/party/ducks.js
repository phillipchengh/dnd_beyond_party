export const ActionTypes = {
  IMPORT_CHARACTER: 'import_character',
};

export const initialState = {
  campaigns: {},
};

export const actions = {
  importCharacter: (character) => ({
    type: ActionTypes.IMPORT_CHARACTER,
    character,
  }),
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.IMPORT_CHARACTER: {
      const campaignId = action.character.campaign.id || 0;
      const campaign = state.campaigns[campaignId] || {};
      return {
        ...state,
        campaigns: {
          ...state.campaigns,
          [campaignId]: {
            ...campaign,
            [action.character.id]: action.character,
          },
        },
      };
    }
    default:
      throw new Error('No action type specified!');
  }
}

export default reducer;
