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
  getRaw,
} from '@assets/character/selectors';

import ExternalLink from '../Graphics/ExternalLink';
import Eye from '../Graphics/Eye';
import Heart from '../Graphics/Heart';
import Language from '../Graphics/Language';
import Shield from '../Graphics/Shield';
import Condition from '../Graphics/Condition';

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
    const extraSenses = getExtraSenses(data);
    return extraSenses.length ? (
      <>
        <h4>Extra Senses</h4>
        <ol>
          {extraSenses.map((extraSense) => (
            <li>
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
          <h4>Defenses</h4>
          <ol>
            {resistances.length ? (
              <li className="resistances">
                <ol>
                  {resistances.map((resistance) => (
                    <li>
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
                    <li>
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
                    <li>
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
        <h4>Conditions</h4>
        <ol>
          {conditions.map((condition) => (
            <li>
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
        <h4>Languages</h4>
        <ol>
          {languages.map((language) => (
            <li>
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
            <h4>Save DC</h4>
            <div>{primaryValue}</div>
            <div>{primaryClasses}</div>
          </li>
          <li className="other_save_dcs">
            {otherSpellSaveDCs?.length ? (
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
