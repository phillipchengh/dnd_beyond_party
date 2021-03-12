import React from 'react';
import PropTypes from 'prop-types';

import WizardMessageDelay from '../Message/WizardMessageDelay';
import Toggle from './Toggle';
import useToggleLogic from './useToggleLogic';
import ShareableLinkExamples from './ShareableLinkExamples';

import './ImportCharacterDescriptionMessages.less';

export function ImportCharacterDescriptionMessages({
  onDone,
}) {
  const [showFormats, setShowFormats] = useToggleLogic();
  const [showCharacterIds, setShowCharacterIds] = useToggleLogic();
  const [showShareableLinks, setShowShareableLinks] = useToggleLogic();

  return (
    <div className="import_character_description_messages">
      <WizardMessageDelay onDone={setShowFormats}>
        <p>
          {'To import your campaign, the wizard needs to scry a public '}
          <a className="dnd_beyond_link" href="https://www.dndbeyond.com/">D&D Beyond</a>
          {' character from your campaign.'}
        </p>
      </WizardMessageDelay>
      <Toggle show={showFormats}>
        <WizardMessageDelay onDone={setShowCharacterIds}>
          <p>
            Acceptable formats are...
          </p>
        </WizardMessageDelay>
      </Toggle>
      <Toggle show={showCharacterIds}>
        <WizardMessageDelay onDone={setShowShareableLinks}>
          <p>
            A Character ID like 41160222...
          </p>
        </WizardMessageDelay>
      </Toggle>
      <Toggle show={showShareableLinks}>
        <WizardMessageDelay onDone={onDone}>
          <ShareableLinkExamples />
        </WizardMessageDelay>
      </Toggle>
    </div>
  );
}

ImportCharacterDescriptionMessages.propTypes = {
  onDone: PropTypes.func.isRequired,
};

export default ImportCharacterDescriptionMessages;
