import React, { useContext } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { actions } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';
import {
  getCampaignLink,
  getCurrentCampaignId,
  getCurrentCampaignName,
  getSortedCurrentCampaignCharacters,
  hasCurrentCampaign,
} from '@assets/party/selectors';
import {
  getClassDisplay,
  getLevelDisplay,
  getId,
  getName,
  getRace,
} from '@assets/character/calcs';
import {
  getAvatarUrl,
  getLink,
  getRaw,
} from '@assets/character/selectors';

import './currentCampaign.less';

export function CurrentCampaign() {
  const { dispatch, state } = useContext(PartyContext);

  const handleDelete = (campaignId) => () => {
    dispatch(actions.deleteCampaign(campaignId));
  };

  const handleSetCurrentCampaign = (campaignId) => () => {
    dispatch(actions.setCurrentCampaign(campaignId));
  };

  const showCurrentCampaign = hasCurrentCampaign(state);
  let currentCampaignId;
  let currentCampaignName;
  let currentCampaignCharacters;
  if (showCurrentCampaign) {
    currentCampaignId = getCurrentCampaignId(state);
    currentCampaignName = getCurrentCampaignName(state);
    currentCampaignCharacters = getSortedCurrentCampaignCharacters(state);
  }

  return (
    <div className="current-campaign">
      <a href={getCampaignLink(state, currentCampaignId)}><h2>{currentCampaignName}</h2></a>
      <button onClick={handleDelete(currentCampaignId)} type="button">Delete</button>
      <div className="characters">
        {currentCampaignCharacters.map(({ lastUpdate, data }) => (
          <div className="character" key={getId(data)}>
            <div class="card-header">
              <img height="60" width="60" src={getAvatarUrl(data)} alt="Avatar" />
              <a href={getLink(data)}><strong>{getName(data)}</strong></a>
            </div>
            <dl>
              <dt>Character ID</dt>
              <dd>{getId(data)}</dd>
              <dt>Last Update</dt>
              <dd>{formatDistanceToNow(lastUpdate)}</dd>
              <dt>Class</dt>
              <dd>{getClassDisplay(data)}</dd>
              <dt>Level</dt>
              <dd>{getLevelDisplay(data)}</dd>
              <dt>Race</dt>
              <dd>{getRace(data)}</dd>
              <dt>Avatar</dt>
              <dd></dd>
              <dt>Link</dt>
              <dt>Raw</dt>
              <dd><a href={getRaw(data)}>Here</a></dd>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrentCampaign;
