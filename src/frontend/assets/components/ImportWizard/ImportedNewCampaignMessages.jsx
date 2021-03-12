import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import { getRaceClassDisplay, getId, getName } from '@assets/character/calcs';

import Toggle from './Toggle';
import WizardMessageDelay from '../Message/WizardMessageDelay';

export function ImportedNewCampaignMessages({
  campaignCharacters, onDone,
}) {
  const [
    showCharacterMessageIndex,
    setShowCharacterMessageIndex,
  ] = useState(0);

  const showNextCharacter = () => {
    // we are done on the last character
    if ((showCharacterMessageIndex + 1) >= campaignCharacters.length) {
      onDone();
    } else {
      setShowCharacterMessageIndex((prevIndex) => (prevIndex + 1));
    }
  };

  return (
    <>
      {campaignCharacters.map(({ data }, index) => {
        const characterName = getName(data);
        const characterRaceClass = getRaceClassDisplay(data);
        // could be a newbie character, so no title
        const characterTitle = characterRaceClass ? `the ${characterRaceClass} ` : '';

        return (
          <Fragment key={getId(data)}>
            <Toggle show={index <= showCharacterMessageIndex}>
              <WizardMessageDelay onDone={showNextCharacter}>
                <p>
                  {`${characterName} ${characterTitle}has joined the fray!`}
                </p>
              </WizardMessageDelay>
            </Toggle>
          </Fragment>
        );
      })}
    </>
  );
}

ImportedNewCampaignMessages.propTypes = {
  campaignCharacters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onDone: PropTypes.func.isRequired,
};

export default ImportedNewCampaignMessages;
