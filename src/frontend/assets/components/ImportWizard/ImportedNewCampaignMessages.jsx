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

  const [showActivePartyMessage, setShowActivePartyMessage] = useToggleLogic();
  const [showFinishMessage, setShowFinishMessage] = useToggleLogic();

  const showNextCharacter = () => {
    // we are done on the last character
    if ((showCharacterMessageIndex + 1) >= campaignCharacters.length) {
      setShowActivePartyMessage();
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
            <strong className="emphasis">{characterRaceClass}</strong>
          </>
        ) : '';

        return (
          <Fragment key={getId(data)}>
            <Toggle show={index <= showCharacterMessageIndex}>
              <WizardMessageDelay onDone={showNextCharacter}>
                <p>
                  <strong className="emphasis">{characterName}</strong>
                  {characterTitle}
                  {' has joined the fray!'}
                </p>
              </WizardMessageDelay>
            </Toggle>
          </Fragment>
        );
      })}
      <Toggle show={showActivePartyMessage}>
        <WizardMessageDelay onDone={setShowFinishMessage}>
          <p>
            {'That looks like your active party in '}
            <strong className="emphasis">{campaignName}</strong>
            .
          </p>
        </WizardMessageDelay>
      </Toggle>
      <Toggle show={showFinishMessage}>
        <WizardMessageDelay onDone={onDone}>
          <p>
            I have saved your party to your browser. We can check them out now!
          </p>
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
