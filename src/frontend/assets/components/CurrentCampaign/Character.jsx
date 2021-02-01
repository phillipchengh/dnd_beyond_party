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
  getSensesDisplay,
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

import ExternalLink from '../Graphics/ExternalLink';
import Heart from '../Graphics/Heart';
import Shield from '../Graphics/Shield';

import './Character.less';

export function Character({
  data,
}) {
  const renderTemporaryHitPoints = () => {
    const temp = getTemporaryHitPoints(data);
    return temp ? (
      <div className="temp_hit_points">
        <h4>Temp</h4>
        <div>{`+${temp}`}</div>
      </div>
    ) : null;
  };

  const renderExtraSenses = () => {
    const extraSenses = getSensesDisplay(data);
    return extraSenses ? (
      <>
        <h4>Extra Senses</h4>
        <div>{extraSenses}</div>
      </>
    ) : null;
  };

  const renderDefenses = () => {
    const resistances = getResistances(data);
    const immunities = getImmunities(data);
    const vulnerabilities = getVulnerabilities(data);
    if (resistances || immunities || vulnerabilities) {
      return (
        <>
          <h4>Defenses</h4>
          <ol>
            {resistances ? (
              <li className="resistances">
                <div className="defense_icon resistance_icon">
                  <Shield />
                </div>
                <p className="defense_value">{resistances}</p>
              </li>
            ) : null}
            {immunities ? (
              <li className="immunities">
                <div className="defense_icon immunity_icon">
                  <Shield />
                </div>
                <p className="defense_value">{immunities}</p>
              </li>
            ) : null}
            {vulnerabilities ? (
              <li className="vulnerabilities">
                <div className="defense_icon vulnerability_icon">
                  <Shield />
                </div>
                <p className="defense_value">{vulnerabilities}</p>
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
    return conditions ? (
      <>
        <h4>Conditions</h4>
        <div>{conditions}</div>
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
            <h4>Save DC</h4>
            <div>{primaryValue}</div>
            <div>{primaryClasses}</div>
          </li>
          <li className="other_save_dcs">
            {otherSpellSaveDCs ? (
              <>
                <h4>Other Save DCs</h4>
                <ol>
                  {otherSpellSaveDCs.map(([value, classes]) => (
                    <li>
                      <div className="other_save_dc_info">
                        <div className="other_save_dc_value">{value}</div>
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
          <a className="dndbeyond_link" href={getLink(data)}>
            <h3 className="name">
              {getName(data)}
            </h3>
            <ExternalLink />
          </a>
          <div className="class">{getClassDisplay(data)}</div>
          <div className="race_json_row">
            <div className="race">{getRace(data)}</div>
            <a className="json" href={getRaw(data)}>JSON</a>
          </div>
          <dd>{getLevelDisplay(data)}</dd>
        </div>
      </header>
      <ol className="grid_info">
        <li className="senses">
          <h4>Passive Senses</h4>
          <dl>
            <div className="passive_score">
              <dt>Perception</dt>
              <dd>{getPassivePerception(data)}</dd>
            </div>
            <div className="passive_score">
              <dt>Investigation</dt>
              <dd>{getPassiveInvestigation(data)}</dd>
            </div>
            <div className="passive_score">
              <dt>Insight</dt>
              <dd>{getPassiveInsight(data)}</dd>
            </div>
          </dl>
        </li>
        <li className="armor_class">
          <Shield />
          <div className="armor_class_info">
            <h4>AC</h4>
            <div>{getArmorClass(data)}</div>
          </div>
        </li>
        <li className="hit_points">
          <Heart />
          <div className="hit_points_info">
            <h4>HP</h4>
            <div>{`${getCurrentHitPoints(data)} / ${getMaxHitPoints(data)}`}</div>
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
          <dl>
            <div className="languages_list">
              <dt>Languages</dt>
              <dd>{getLanguages(data)}</dd>
            </div>
          </dl>
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
