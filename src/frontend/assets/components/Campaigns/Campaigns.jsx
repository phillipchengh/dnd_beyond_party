import React, { useContext, useState } from 'react';

import { actions } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';
import {
  getCampaigns,
  getCampaignName,
  getCurrentCampaignId,
  getCurrentCampaignName,
  getSortedCurrentCampaignCharacters,
  hasCurrentCampaign,
  hasCampaigns,
} from '@assets/party/selectors';

import CurrentCampaign from '../CurrentCampaign/CurrentCampaign';
import ImportWizardModal from '../ImportWizard/ImportWizardModal';

import './campaigns.less';

export function Campaigns() {
  const { dispatch, state } = useContext(PartyContext);

  const handleSetCurrentCampaign = (campaignId) => () => {
    dispatch(actions.setCurrentCampaign(campaignId));
  };

  const campaigns = getCampaigns(state);
  const showCurrentCampaign = hasCurrentCampaign(state);
  let currentCampaignId;
  let currentCampaignName;
  let currentCampaignCharacters;
  if (showCurrentCampaign) {
    currentCampaignId = getCurrentCampaignId(state);
    currentCampaignName = getCurrentCampaignName(state);
    currentCampaignCharacters = getSortedCurrentCampaignCharacters(state);
  }

  const hasNoCampaigns = !hasCampaigns(state);
  // if they have no campaigns, force show them the modal
  const [showImportWizard, setShowImportWizard] = useState(hasNoCampaigns);

  const handleOpenImportWizard = () => {
    setShowImportWizard(true);
  };

  const handleCloseImportWizard = !hasNoCampaigns ? () => {
    setShowImportWizard(false);
  } : null;

  return (
    <>
      <div className="sidenav">
        <h2>Campaigns</h2>
        <div>
          {Object.keys(campaigns).map((campaignId) => (
            <button onClick={handleSetCurrentCampaign(campaignId)} type="button" key={campaignId} className={`campaign ${currentCampaignName === getCampaignName(state, campaignId) ? 'current' : ''}`}>
              <strong>{getCampaignName(state, campaignId)}</strong>
            </button>
          ))}
        </div>
        <button className="fill" onClick={handleOpenImportWizard}  type="button">Import New Campaign</button>
      </div>
      <ImportWizardModal
        isOpen={showImportWizard}
        onRequestClose={handleCloseImportWizard}
      />
      {showCurrentCampaign && <CurrentCampaign />}
    </>
  );
}

export default Campaigns;
