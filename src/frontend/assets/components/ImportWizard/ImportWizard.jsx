import React, {
  Fragment,
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
import { getName } from '@assets/character/calcs';

import WizardHat from '../Graphics/WizardHat';

import Toggle from './Toggle';
import useToggleLogic from './useToggleLogic';

import ImportCharacterDescriptionMessages from './ImportCharacterDescriptionMessages';
import ImportCharacterMessage from './ImportCharacterMessage';
import ImportedCampaignMessages from './ImportedCampaignMessages';

import UserMessageButton from '../Message/UserMessageButton';
import WizardMessageDelay from '../Message/WizardMessageDelay';
import WizardMessageDanger from '../Message/WizardMessageDanger';
import WizardMessageMagic from '../Message/WizardMessageMagic';

import ArrowRight from '../Graphics/ArrowRight';

import './ImportWizard.less';

export function ImportWizard({
  onAbort, onDone, showWelcomeMessage,
}) {
  const { dispatch, state } = useContext(PartyContext);
  const [characterToImport, setCharacterToImport] = useState(null);
  const [isExistingCampaign, setIsExistingCampaign] = useState(false);

  const reset = useCallback(() => {
    dispatch(actions.clearError());
    setCharacterToImport(null);
    setIsExistingCampaign(false);
  }, [dispatch]);

  // reset wizard when it's re-opened
  useEffect(() => {
    reset();
  }, [reset]);

  let characterCampaign = null;
  let campaignId = null;
  if (characterToImport) {
    campaignId = getCampaignId(characterToImport);
    characterCampaign = getCampaign(state, campaignId);
  }
  const importedCampaign = isImportedCampaign(characterCampaign);

  useEffect(() => {
    // set current campaign as the campaign they just imported
    if (importedCampaign) {
      dispatch(actions.setCurrentCampaign(campaignId));
    }
  }, [dispatch, importedCampaign, campaignId]);

  // this error is probably local storage bad news
  const error = getError(state);

  const [showDescription, setShowDescription] = useState(!showWelcomeMessage);

  const handleWelcomeMessageDone = () => {
    setShowDescription(true);
  };

  const [showImportCharacter, setShowImportCharacter] = useToggleLogic();

  const handleDescriptionDone = () => {
    setShowImportCharacter();
  };

  // because of errors, we may ask them to re-submit their character
  // so there can be a variable amount of messages here
  // it's represented by submitTries and its properties are its current state reflected on the UI
  const [submitTries, setSubmitTries] = useState([{
    doneFoundCharacterMessage: false,
    foundCharacter: null,
    loading: false,
    errorMessage: null,
  }]);

  const setImportLoading = (loading) => {
    setSubmitTries(
      (prevSubmitTries) => {
        const nextSubmitTries = [...prevSubmitTries];
        nextSubmitTries[nextSubmitTries.length - 1].loading = loading;
        return nextSubmitTries;
      },
    );
  };

  const setImportFoundCharacter = (foundCharacter) => {
    setSubmitTries(
      (prevSubmitTries) => {
        const nextSubmitTries = [...prevSubmitTries];
        nextSubmitTries[nextSubmitTries.length - 1].foundCharacter = foundCharacter;
        return nextSubmitTries;
      },
    );
  };

  const setDoneFoundCharacterMessage = () => {
    setSubmitTries(
      (prevSubmitTries) => {
        const nextSubmitTries = [...prevSubmitTries];
        nextSubmitTries[nextSubmitTries.length - 1].doneFoundCharacterMessage = true;
        return nextSubmitTries;
      },
    );
  };

  const setImportError = (errorMessage) => {
    setSubmitTries(
      (prevSubmitTries) => {
        const nextSubmitTries = [...prevSubmitTries];
        nextSubmitTries[nextSubmitTries.length - 1].loading = false;
        nextSubmitTries[nextSubmitTries.length - 1].errorMessage = errorMessage;
        nextSubmitTries.push({ loading: false, errorMessage: null });
        return nextSubmitTries;
      },
    );
  };

  const isFoundCharacterMessageDone = () => (
    submitTries[submitTries.length - 1].doneFoundCharacterMessage
  );

  const handleCharacterImport = async (ddbCharacterId) => {
    setImportLoading(true);
    try {
      const character = await getCharacter(ddbCharacterId);
      // show character details while we sift through the campaign data
      // immediate message, still could have failure
      setImportFoundCharacter(character);
      // for character access post import campaign
      setCharacterToImport(character);
      // different logic if campaign already exists
      const campaign = getCampaign(state, getCampaignId(character));
      if (isImportedCampaign(campaign)) {
        setIsExistingCampaign(true);
      }
      // parse and import campaign characters from the character's campaign data
      await importCampaign({ dispatch, state }, character);
      setImportLoading(false);
    } catch (e) {
      setImportError(e.message);
    }
  };

  const [showImportDone, setShowImportDone] = useToggleLogic();

  return (
    <div className="import_wizard">
      <div className="wizardhat_wrapper">
        <WizardHat />
      </div>
      {/* all components below should be messages only... */}
      <Toggle show={showWelcomeMessage}>
        <WizardMessageDelay
          className="welcome_message"
          onDone={handleWelcomeMessageDone}
        >
          <p>
            {'Welcome to '}
            <strong className="emphasis">D&D Beyond Party</strong>
            , where you can view your party all in one screen!
          </p>
        </WizardMessageDelay>
      </Toggle>
      <Toggle show={showDescription}>
        <ImportCharacterDescriptionMessages
          onDone={handleDescriptionDone}
        />
      </Toggle>
      <Toggle show={showImportCharacter}>
        <ImportCharacterMessage
          onSubmit={handleCharacterImport}
        />
        {submitTries.map(({
          doneFoundCharacterMessage, foundCharacter, loading, errorMessage,
        }, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>
            {/* show loading while we are querying the character */}
            {loading && !foundCharacter && <WizardMessageMagic>Scrying</WizardMessageMagic>}
            {/* flip from loading to this message if we found a character */}
            {foundCharacter && (
              <WizardMessageDelay
                className="import_wizard_message"
                onDone={setDoneFoundCharacterMessage}
              >
                <p>
                  {'I found '}
                  <strong className="emphasis">{getName(foundCharacter)}</strong>
                  !
                </p>
              </WizardMessageDelay>
            )}
            {/* when importing the rest of the campaign */}
            {loading && doneFoundCharacterMessage && (
              <WizardMessageMagic>
                Scrying for other party members
              </WizardMessageMagic>
            )}
            {/* error when something happened during the import */}
            {/* we haven't committed to importing yet, so add another form message to try again */}
            {errorMessage && (
              <>
                <WizardMessageDanger>{errorMessage}</WizardMessageDanger>
                <ImportCharacterMessage
                  onSubmit={handleCharacterImport}
                />
              </>
            )}
          </Fragment>
        ))}
      </Toggle>
      {/* if in modal, offer exit immediately */}
      {/* otherwise.... show the error somewhere else :( */}
      {onAbort && error && (
        <>
          <WizardMessageDanger>{error}</WizardMessageDanger>
          <UserMessageButton onClick={onAbort}>
            <div className="continue_button_wrapper">
              Quit
              <ArrowRight />
            </div>
          </UserMessageButton>
        </>
      )}
      {/* at this point we committed to importing the campaign, show the data and exit */}
      {importedCampaign && isFoundCharacterMessageDone() && (
        <ImportedCampaignMessages
          campaign={characterCampaign}
          inputCharacter={characterToImport}
          isExistingCampaign={isExistingCampaign}
          onDone={setShowImportDone}
        />
      )}
      {/* done showing imported campaign, get them out */}
      {showImportDone && (
        <UserMessageButton onClick={onDone}>
          <div className="continue_button_wrapper">
            {`View ${characterCampaign.name}`}
            <ArrowRight />
          </div>
        </UserMessageButton>
      )}
    </div>
  );
}

ImportWizard.propTypes = {
  onAbort: PropTypes.func,
  onDone: PropTypes.func.isRequired,
  showWelcomeMessage: PropTypes.bool,
};

ImportWizard.defaultProps = {
  onAbort: null,
  showWelcomeMessage: false,
};

export default ImportWizard;
