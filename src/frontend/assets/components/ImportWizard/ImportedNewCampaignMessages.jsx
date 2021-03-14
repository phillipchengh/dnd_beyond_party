import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import { getRaceClassDisplay, getId, getName } from '@assets/character/calcs';

import Toggle from './Toggle';
import WizardMessageDelay from '../Message/WizardMessageDelay';
import useToggleLogic from './useToggleLogic';

import './ImportedNewCampaignMessages.less';

export function ImportedNewCampaignMessages({
  campaignCharacters, campaignName, onDone,
}) {
  const [
    showCharacterMessageIndex,
    setShowCharacterMessageIndex,
  ] = useState(0);

  const [showFinishMessage, setShowFinishMessage] = useToggleLogic();

  const showNextCharacter = () => {
    // we are done on the last character
    if ((showCharacterMessageIndex + 1) >= campaignCharacters.length) {
      setShowFinishMessage();
    } else {
      setShowCharacterMessageIndex((prevIndex) => (prevIndex + 1));
    }
  };

  return (
    <div className="imported_new_campaign_messages">
      {campaignCharacters.map(({ data }, index) => {
        const characterName = getName(data);
        const characterRaceClass = getRaceClassDisplay(data);
        // could be a newbie character, so no title
        const characterTitle = characterRaceClass ? (
          <>
            {' the '}
            <strong className="character_emphasis">{characterRaceClass}</strong>
          </>
        ) : '';

        return (
          <Fragment key={getId(data)}>
            <Toggle show={index <= showCharacterMessageIndex}>
              <WizardMessageDelay onDone={showNextCharacter}>
                <p>
                  <strong className="character_emphasis">{characterName}</strong>
                  {characterTitle}
                  {' has joined the fray!'}
                </p>
              </WizardMessageDelay>
            </Toggle>
          </Fragment>
        );
      })}
      <Toggle show={showFinishMessage}>
        <WizardMessageDelay onDone={onDone}>
          {`That looks like everyone active in ${campaignName}. We can check the party out now!`}
        </WizardMessageDelay>
      </Toggle>
    </div>
  );
}

ImportedNewCampaignMessages.propTypes = {
  campaignCharacters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  campaignName: PropTypes.string.isRequired,
  onDone: PropTypes.func.isRequired,
};

export default ImportedNewCampaignMessages;
