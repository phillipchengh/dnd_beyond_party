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
  getStrengthAbilityScore,
  getDexterityAbilityScore,
  getConstitutionAbilityScore,
  getIntelligenceAbilityScore,
  getWisdomAbilityScore,
  getCharismaAbilityScore,
  getPassivePerception,
  getPassiveInvestigation,
  getPassiveInsight,
  getArmorClass,
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
      <button onClick={handleDelete(currentCampaignId)} type="button">Delete {currentCampaignName}</button>
      <div className="characters">
        {currentCampaignCharacters.map(({ lastUpdate, data }) => (
          <div className="character" key={getId(data)}>
            <div className="character-header">
              <img src={getAvatarUrl(data)} alt="Avatar" />
              <a href={getLink(data)}><strong>{getName(data)}</strong></a>
              <div>{getClassDisplay(data)} {getLevelDisplay(data)} | {getRace(data)}</div>
            </div>
            <dl>
              <dt>Raw</dt>
              <dd><a href={getRaw(data)}>Here</a></dd>
              <dt>Strength</dt>
              <dd>{getStrengthAbilityScore(data)}</dd>
              <dt>Dexterity</dt>
              <dd>{getDexterityAbilityScore(data)}</dd>
              <dt>Constitution</dt>
              <dd>{getConstitutionAbilityScore(data)}</dd>
              <dt>Intelligence</dt>
              <dd>{getIntelligenceAbilityScore(data)}</dd>
              <dt>Wisdom</dt>
              <dd>{getWisdomAbilityScore(data)}</dd>
              <dt>Charisma</dt>
              <dd>{getCharismaAbilityScore(data)}</dd>
              <dt>Passive Perception</dt>
              <dd>{getPassivePerception(data)}</dd>
              <dt>Passive Investigation</dt>
              <dd>{getPassiveInvestigation(data)}</dd>
              <dt>Passive Insight</dt>
              <dd>{getPassiveInsight(data)}</dd>
              <dt>Armor Class</dt>
              <dd>{getArmorClass(data)}</dd>
              <dt>Character ID</dt>
              <dd>{getId(data)}</dd>
              <dt>Last Update</dt>
              <dd>{formatDistanceToNow(lastUpdate)}</dd>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrentCampaign;
