import React from 'react';
import PropTypes from 'prop-types';

import { getName } from '@assets/character/calcs';
import {
  areSoloAdventurers,
  formatCampaignCharacters,
  isEmptyCampaign,
} from '@assets/party/utilities';

import WizardMessageDelay from '../Message/WizardMessageDelay';
import WizardMessageDanger from '../Message/WizardMessageDanger';
import ImportedNewCampaignMessages from './ImportedNewCampaignMessages';

import useToggleLogic from './useToggleLogic';

import './ImportedCampaignMessages.less';

export function ImportedCampaignMessages({
  campaign,
  inputCharacter,
  isExistingCampaign,
  onDone,
}) {
  const [showCharacters, setShowCharacters] = useToggleLogic();

  // does this happen?
  if (isEmptyCampaign(campaign)) {
    return (
      <WizardMessageDanger>
        {'We found no active characters in the imported character\'s campaign. Please refresh and try another character.'}
      </WizardMessageDanger>
    );
  }

  const inputCharacterName = getName(inputCharacter);

  // return early if the character doesn't have its own campaign
  if (areSoloAdventurers(campaign)) {
    return (
      <WizardMessageDelay className="imported_campaign_messages" onDone={onDone}>
        {'I have added '}
        <strong className="emphasis">{inputCharacterName}</strong>
        {' to the campaign '}
        <strong className="emphasis">Solo Adventurers</strong>
        !
      </WizardMessageDelay>
    );
  }

  const {
    characters, name,
  } = campaign;

  // return early if we just updated a campaign which already exists
  if (isExistingCampaign) {
    return (
      <WizardMessageDelay className="imported_campaign_messages" onDone={onDone}>
        {'It looks like '}
        <strong className="emphasis">{inputCharacterName}</strong>
        {' is in '}
        <strong className="emphasis">{name}</strong>
        {'. I have updated '}
        <strong className="emphasis">{name}</strong>
        !
      </WizardMessageDelay>
    );
  }

  // when we get to here, we are importing a new campaign
  // display each character, then return

  const campaignCharacters = formatCampaignCharacters(characters);

  return (
    <>
      <WizardMessageDelay className="imported_campaign_messages" onDone={setShowCharacters}>
        {'I have invited everyone from '}
        <strong className="emphasis">{name}</strong>
        !
      </WizardMessageDelay>
      {showCharacters && (
        <ImportedNewCampaignMessages
          campaignCharacters={campaignCharacters}
          campaignName={name}
          onDone={onDone}
        />
      )}
    </>
  );
}

ImportedCampaignMessages.propTypes = {
  campaign: PropTypes.shape({
    characters: PropTypes.shape({}).isRequired,
    id: PropTypes.number.isRequired,
    lastUpdate: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  inputCharacter: PropTypes.shape({}).isRequired,
  isExistingCampaign: PropTypes.bool.isRequired,
  onDone: PropTypes.func.isRequired,
};

export default ImportedCampaignMessages;
