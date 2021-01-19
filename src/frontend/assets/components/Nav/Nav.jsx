import React, { useContext, useState } from 'react';

import PartyContext from '@assets/party/Context';
import { hasCampaigns } from '@assets/party/selectors';

import ImportWizardModal from '@assets/components/ImportWizard/ImportWizardModal';
import Campaigns from '@assets/components/Campaigns/Campaigns';

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
      <h1 className="header">D&D Beyond Party</h1>
      <button onClick={handleOpenImportWizard} type="button">Import Character</button>
      <ImportWizardModal
        isOpen={showImportWizard}
        onRequestClose={handleCloseImportWizard}
      />
      <Campaigns campaigns={state.campaigns} />
    </>
  );
}

export default Nav;
