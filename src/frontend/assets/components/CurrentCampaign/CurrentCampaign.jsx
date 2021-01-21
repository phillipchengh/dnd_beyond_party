import React, { useContext, useState } from 'react';

import PartyContext from '@assets/party/Context';

import { actions } from '@assets/party/ducks';

import {
  getCurrentCampaignName,
  getCurrentCampaignLink,
  getSortedCurrentCampaignCharacters,
  hasCurrentCampaign,
} from '@assets/party/selectors';

import {
  getId,
} from '@assets/character/calcs';

import Updater from '@assets/components/Updater/Updater';
import Character from './Character';

export function CurrentCampaign() {
  const { dispatch, state } = useContext(PartyContext);

  const showCurrentCampaign = hasCurrentCampaign(state);
  let currentCampaignName;
  let currentCampaignCharacters;
  if (showCurrentCampaign) {
    currentCampaignName = getCurrentCampaignName(state);
    currentCampaignCharacters = getSortedCurrentCampaignCharacters(state);
  }

  const [deleteMessage, setDeleteMessage] = useState(null);

  const handleDelete = () => {
    // use the campaign name before we lose it
    setDeleteMessage(`We deleted ${currentCampaignName}!`);
    dispatch(actions.deleteCurrentCampaign());
  };

  return (
    <div className="current_campaign">
      {!showCurrentCampaign && (
        <>
          {deleteMessage && <p>{deleteMessage}</p>}
          <p>Pick a Current Campaign from the left!</p>
        </>
      )}
      {showCurrentCampaign && (
        <>
          <Updater />
          <h2>{`Current Campaign: ${currentCampaignName}`}</h2>
          <button onClick={handleDelete} type="button">Delete</button>
          <a href={getCurrentCampaignLink(state)}>DnD Beyond Link</a>
          <ol>
            {currentCampaignCharacters.map(({ lastUpdate, data }) => (
              <li key={getId(data)}>
                <Character
                  data={data}
                  lastUpdate={lastUpdate}
                />
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

export default CurrentCampaign;
