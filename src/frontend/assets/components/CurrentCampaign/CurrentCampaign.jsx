import React, { useContext } from 'react';

import PartyContext from '@assets/party/Context';

import {
  getCurrentCampaignName,
  getSortedCurrentCampaignCharacters,
  hasCurrentCampaign,
} from '@assets/party/selectors';

import {
  getId,
} from '@assets/character/calcs';

import Character from './Character';

export function CurrentCampaign() {
  const { state } = useContext(PartyContext);

  const showCurrentCampaign = hasCurrentCampaign(state);
  let currentCampaignName;
  let currentCampaignCharacters;
  if (showCurrentCampaign) {
    currentCampaignName = getCurrentCampaignName(state);
    currentCampaignCharacters = getSortedCurrentCampaignCharacters(state);
  }

  return (
    <>
      {showCurrentCampaign && (
        <>
          <h2>{`Current Campaign: ${currentCampaignName}`}</h2>
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
    </>
  );
}

export default CurrentCampaign;
