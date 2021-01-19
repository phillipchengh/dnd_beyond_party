import React from 'react';
import PropTypes from 'prop-types';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

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
  getSpellSaveDCs,
  getLanguages,
  getCurrentHitPoints,
  getMaxHitPoints,
  getTemporaryHitPoints,
  getResistances,
  getImmunities,
  getVulnerabilities,
  getConditions,
} from '@assets/character/calcs';

import {
  getAvatarUrl,
  getLink,
  getRaw,
} from '@assets/character/selectors';

export function Character({
  lastUpdate, data,
}) {
  return (
    <>
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
        <dt>Spell Save DC</dt>
        <dd>{getSpellSaveDCs(data)}</dd>
        <dt>Languages</dt>
        <dd>{getLanguages(data)}</dd>
        <dt>Current Hit Points</dt>
        <dd>{getCurrentHitPoints(data)}</dd>
        <dt>Max Hit Points</dt>
        <dd>{getMaxHitPoints(data)}</dd>
        <dt>Temporary Hit Points</dt>
        <dd>{getTemporaryHitPoints(data)}</dd>
        <dt>Resistances</dt>
        <dd>{getResistances(data)}</dd>
        <dt>Immunities</dt>
        <dd>{getImmunities(data)}</dd>
        <dt>Vulnerabilities</dt>
        <dd>{getVulnerabilities(data)}</dd>
        <dt>Conditions</dt>
        <dd>{getConditions(data)}</dd>
      </dl>
    </>
  );
}

Character.propTypes = {
  lastUpdate: PropTypes.number.isRequired,
  data: PropTypes.shape({}).isRequired,
};

export default Character;
