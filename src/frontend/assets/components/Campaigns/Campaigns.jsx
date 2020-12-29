import React, { useContext } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { actions } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';
import {
  getCampaigns,
  getCampaignName,
  getCampaignLastUpdate,
  getCampaignLink,
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

export function Campaigns() {
  const { dispatch, state } = useContext(PartyContext);

  const handleDelete = (campaignId) => () => {
    dispatch(actions.deleteCampaign(campaignId));
  };

  const handleSetCurrentCampaign = (campaignId) => () => {
    dispatch(actions.setCurrentCampaign(campaignId));
  };

  const campaigns = getCampaigns(state);
  const showCurrentCampaign = hasCurrentCampaign(state);
  let currentCampaignName;
  let currentCampaignCharacters;
  if (showCurrentCampaign) {
    currentCampaignName = getCurrentCampaignName(state);
    currentCampaignCharacters = getSortedCurrentCampaignCharacters(state);
  }

  return (
    <>
      <h2>Campaigns</h2>
      <ol>
        {Object.keys(campaigns).map((campaignId) => (
          <li key={campaignId}>
            <div><strong>{getCampaignName(state, campaignId)}</strong></div>
            <button onClick={handleSetCurrentCampaign(campaignId)} type="button">
              View
            </button>
            <button onClick={handleDelete(campaignId)} type="button">Delete</button>
            <dl>
              <dt>Campaign ID</dt>
              <dd>{campaignId}</dd>
              <dt>Last Update</dt>
              <dd>{getCampaignLastUpdate(state, campaignId)}</dd>
              {getCampaignLink(state, campaignId) && (
                <>
                  <dt>Link</dt>
                  <dd><a href={getCampaignLink(state, campaignId)}>Here</a></dd>
                </>
              )}
            </dl>
          </li>
        ))}
      </ol>
      {showCurrentCampaign && (
        <>
          <h2>{`Current Campaign: ${currentCampaignName}`}</h2>
          <ol>
            {currentCampaignCharacters.map(({ lastUpdate, data }) => (
              <li key={getId(data)}>
                <div><strong>{getName(data)}</strong></div>
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
                  <dd><img height="60" width="60" src={getAvatarUrl(data)} alt="Avatar" /></dd>
                  <dt>Link</dt>
                  <dd><a href={getLink(data)}>Here</a></dd>
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
                </dl>
              </li>
            ))}
          </ol>
        </>
      )}
    </>
  );
}

export default Campaigns;
