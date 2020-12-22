import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import getCharacter from '@assets/api';
import { actions } from '@assets/party/ducks';
import { getCampaign, getError } from '@assets/party/selectors';
import PartyContext from '@assets/party/Context';
import { importCampaign } from '@assets/party/sideEffects';
import { isImportedCampaign } from '@assets/party/utilities';
import { getCampaignId } from '@assets/character/selectors';

import Modal from './Modal';
import ImportCharacter from './ImportCharacter';
import FoundCharacterInfo from './FoundCharacterInfo';
import ImportedCampaignInfo from './ImportedCampaignInfo';

export function ImportWizardModal({ isOpen, onRequestClose }) {
  const { dispatch, state } = useContext(PartyContext);
  const [characterToImport, setCharacterToImport] = useState(null);
  const [isExistingCampaign, setIsExistingCampaign] = useState(false);
  const [requestError, setRequestError] = useState(null);

  let characterCampaign = null;
  let campaignId = null;
  if (characterToImport) {
    campaignId = getCampaignId(characterToImport);
    characterCampaign = getCampaign(state, campaignId);
  }
  const importedCampaign = isImportedCampaign(characterCampaign);

  const handleCharacterImport = async (ddbCharacterId) => {
    setRequestError(null);
    try {
      const character = await getCharacter(ddbCharacterId);
      // show character details while we sift through the campaign data
      setCharacterToImport(character);
      // different logic if campaign already exists
      if (isImportedCampaign(getCampaign(state, getCampaignId(character)))) {
        setIsExistingCampaign(true);
      }
      // parse and import campaign characters from the character's campaign data
      await importCampaign({ dispatch, state }, character);
    } catch (e) {
      setRequestError(e.message);
    }
  };

  const reset = useCallback(() => {
    dispatch(actions.clearError());
    setCharacterToImport(null);
    setIsExistingCampaign(false);
  }, [dispatch]);

  useEffect(() => {
    // set current campaign as the last campaign they've touched
    if (importedCampaign) {
      dispatch(actions.setCurrentCampaign(campaignId));
    }
  }, [dispatch, importedCampaign, campaignId]);

  useEffect(() => {
    reset();
  }, [isOpen, reset]);

  const error = requestError || getError(state);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      {!characterToImport && (
        <ImportCharacter
          onSubmit={handleCharacterImport}
          error={error}
        />
      )}
      {characterToImport && (
        <FoundCharacterInfo
          character={characterToImport}
          error={error}
        />
      )}
      {/* Case where character was retrieved, but something borked importing/saving the campaign */}
      {characterToImport && error && <button onClick={reset} type="button">Start Over</button>}
      {importedCampaign && (
        <ImportedCampaignInfo
          campaign={characterCampaign}
          isExistingCampaign={isExistingCampaign}
        />
      )}
      {importedCampaign && <button onClick={reset} type="button">Done</button>}
    </Modal>
  );
}

ImportWizardModal.propTypes = {
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
};

ImportWizardModal.defaultProps = {
  isOpen: false,
  onRequestClose: null,
};

export default ImportWizardModal;
