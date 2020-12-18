import React, { useContext, useState } from 'react';

import PartyContext from '@assets/party/Context';
import { hasCampaigns } from '@assets/party/selectors';

import ImportWizardModal from './ImportWizard/ImportWizardModal';
import Updater from './Updater/Updater';
import Campaigns from './Campaigns/Campaigns';

export function Main() {
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
    <main>
      <h1>D&D Beyond Party</h1>
      <button onClick={handleOpenImportWizard} type="button">Import Character</button>
      <ImportWizardModal
        isOpen={showImportWizard}
        onRequestClose={handleCloseImportWizard}
      />
      <Updater />
      <Campaigns campaigns={state.campaigns} />
    </main>
  );
}

export default Main;
