import React, { useContext, useState } from 'react';

import PartyContext from '@assets/party/Context';
import { hasCampaigns } from '@assets/party/selectors';

import ImportWizardModal from '@assets/components/ImportWizard/ImportWizardModal';
import Campaigns from '@assets/components/Campaigns/Campaigns';

import './Nav.less';

export function Nav() {
  const { state } = useContext(PartyContext);
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
      <div className="nav_overlay" />
      <div className="nav">
        <h1 className="header">D&D Beyond Party</h1>
        <Campaigns campaigns={state.campaigns} />
        <button
          className="import_button"
          onClick={handleOpenImportWizard}
          type="button"
        >
          Import Campaign
        </button>
        <ImportWizardModal
          isOpen={showImportWizard}
          onRequestClose={handleCloseImportWizard}
        />
      </div>
    </>
  );
}

export default Nav;
