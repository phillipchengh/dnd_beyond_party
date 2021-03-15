import React from 'react';
import PropTypes from 'prop-types';

import {
  getClassDisplay,
  getLevelDisplay,
  getName,
  getRace,
  getPassivePerception,
  getPassiveInvestigation,
  getPassiveInsight,
  getExtraSenses,
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
  // getRaw, // uncomment for json links
} from '@assets/character/selectors';

import StatHeader from './StatHeader';

import ExternalLink from '../Graphics/ExternalLink';
import Eye from '../Graphics/Eye';
import Heart from '../Graphics/Heart';
import Language from '../Graphics/Language';
import Shield from '../Graphics/Shield';
import Condition from '../Graphics/Condition';

import Tooltip from '../Common/Tooltip';

import './Character.less';

export function Character({
  data,
}) {
  const renderTemporaryHitPoints = () => {
    const temp = getTemporaryHitPoints(data);
    return temp ? (
      <div className="temp_hit_points">
        <StatHeader bottomBorder={false}>Temp</StatHeader>
        <div className="temp_hit_points_score">{`+${temp}`}</div>
      </div>
    ) : null;
  };

  const renderExtraSenses = () => {
    const extraSenses = getExtraSenses(data);
    return extraSenses.length ? (
      <>
        <StatHeader>Extra Senses</StatHeader>
        <ol>
          {extraSenses.map((extraSense) => (
            <li key={extraSense}>
              <span className="bullet_icon eye_icon">
                <Eye />
              </span>
              {extraSense}
            </li>
          ))}
        </ol>
      </>
    ) : null;
  };

  const renderDefenses = () => {
    const resistances = getResistances(data);
    const immunities = getImmunities(data);
    const vulnerabilities = getVulnerabilities(data);
    if (resistances.length || immunities.length || vulnerabilities.length) {
      return (
        <>
          <StatHeader>Defenses</StatHeader>
          <ol>
            {resistances.length ? (
              <li className="resistances">
                <ol>
                  {resistances.map((resistance) => (
                    <li key={resistance}>
                      <span className="bullet_icon defense_icon resistance_icon">
                        <Shield />
                      </span>
                      {resistance}
                    </li>
                  ))}
                </ol>
              </li>
            ) : null}
            {immunities.length ? (
              <li className="immunities">
                <ol>
                  {immunities.map((immunity) => (
                    <li key={immunity}>
                      <span className="bullet_icon defense_icon immunity_icon">
                        <Shield />
                      </span>
                      {immunity}
                    </li>
                  ))}
                </ol>
              </li>
            ) : null}
            {vulnerabilities.length ? (
              <li className="vulnerabilities">
                <ol>
                  {vulnerabilities.map((vulnerability) => (
                    <li key={vulnerability}>
                      <span className="bullet_icon defense_icon vulnerability_icon">
                        <Shield />
                      </span>
                      {vulnerability}
                    </li>
                  ))}
                </ol>
              </li>
            ) : null}
          </ol>
        </>
      );
    }
    return null;
  };

  const renderConditions = () => {
    const conditions = getConditions(data);
    return conditions.length ? (
      <>
        <StatHeader>Conditions</StatHeader>
        <ol>
          {conditions.map((condition) => (
            <li key={condition}>
              <span className="bullet_icon condition_icon">
                <Condition />
              </span>
              {condition}
            </li>
          ))}
        </ol>
      </>
    ) : null;
  };

  const renderLanguages = () => {
    const languages = getLanguages(data);
    return languages.length ? (
      <>
        <StatHeader>Languages</StatHeader>
        <ol>
          {languages.map((language) => (
            <li key={language}>
              <span className="bullet_icon language_icon">
                <Language />
              </span>
              {language}
            </li>
          ))}
        </ol>
      </>
    ) : null;
  };

  const renderSpellSaveDCItems = () => {
    const spellSaveDCs = getSpellSaveDCs(data) ?? [];
    const [primarySpellSaveDC, ...otherSpellSaveDCs] = spellSaveDCs;
    if (primarySpellSaveDC) {
      const [primaryValue, primaryClasses] = primarySpellSaveDC;
      return (
        <>
          <li className="primary_save_dc">
            <StatHeader>Save DC</StatHeader>
            <div className="primary_save_dc_score">{primaryValue}</div>
            <div>{primaryClasses}</div>
          </li>
          <li className="other_save_dcs">
            {otherSpellSaveDCs?.length ? (
              <>
                <StatHeader>Other Save DCs</StatHeader>
                <ol>
                  {otherSpellSaveDCs.map(([value, classes]) => (
                    <li key={classes}>
                      <div className="other_save_dc_info">
                        <div className="other_save_dc_score">{value}</div>
                        <div className="other_save_dc_classes">{classes}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
          </li>
        </>
      );
    }
    return null;
  };

  return (
    <article className="character">
      <header className="header">
        <img
          alt="Avatar"
          className="avatar"
          src={getAvatarUrl(data)}
        />
        <div className="info">
          <Tooltip title={`View ${getName(data)} on D&D Beyond`}>
            <a className="dndbeyond_link" href={getLink(data)}>
              <h3 className="name">
                {getName(data)}
              </h3>
              <ExternalLink />
            </a>
          </Tooltip>
          <div className="class">{getClassDisplay(data)}</div>
          <div className="race_json_row">
            <div className="race">{getRace(data)}</div>
            {/* uncomment to reveal json links */}
            {/* <a className="json" href={getRaw(data)}>JSON</a> */}
          </div>
          <div>{getLevelDisplay(data)}</div>
        </div>
      </header>
      <ol className="grid_info">
        <li className="senses">
          <StatHeader>Passive Senses</StatHeader>
          <dl>
            <div className="passive_score_row">
              <dt>Perception</dt>
              <dd className="passive_score">{getPassivePerception(data)}</dd>
            </div>
            <div className="passive_score_row">
              <dt>Investigation</dt>
              <dd className="passive_score">{getPassiveInvestigation(data)}</dd>
            </div>
            <div className="passive_score_row">
              <dt>Insight</dt>
              <dd className="passive_score">{getPassiveInsight(data)}</dd>
            </div>
          </dl>
        </li>
        <li className="armor_class">
          <Shield />
          <div className="armor_class_info">
            <StatHeader bottomBorder={false}>AC</StatHeader>
            <div className="armor_class_score">{getArmorClass(data)}</div>
          </div>
        </li>
        <li className="hit_points">
          <Heart />
          <div className="hit_points_info">
            <StatHeader bottomBorder={false}>HP</StatHeader>
            <div className="hit_points_score">{`${getCurrentHitPoints(data)} / ${getMaxHitPoints(data)}`}</div>
          </div>
          {renderTemporaryHitPoints()}
        </li>
        <li className="extra_senses">
          {renderExtraSenses()}
        </li>
        <li className="defenses">
          {renderDefenses()}
        </li>
        <li className="conditions">
          {renderConditions()}
        </li>
        <li className="languages">
          {renderLanguages()}
        </li>
        {renderSpellSaveDCItems()}
      </ol>
    </article>
  );
}

Character.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default Character;
