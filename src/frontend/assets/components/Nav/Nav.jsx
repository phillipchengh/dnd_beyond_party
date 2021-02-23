import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import PartyContext from '@assets/party/Context';
import { hasCampaigns } from '@assets/party/selectors';

import ImportWizardModal from '@assets/components/ImportWizard/ImportWizardModal';
import Campaigns from '@assets/components/Campaigns/Campaigns';

import Drawer from '../Common/Drawer';

import './Nav.less';

export function Nav({
  desktopOpen, mobileOpen, onDesktopClose, onDesktopOpen, onMobileClose, onMobileOpen,
}) {
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

  // common nav content for desktop and mobile drawers
  const renderNavContent = () => (
    <>
      <Campaigns campaigns={state.campaigns} />
      <button
        className="import_button"
        onClick={handleOpenImportWizard}
        type="button"
      >
        Import Campaign
      </button>
    </>
  );

  return (
    <>
      <ImportWizardModal
        isOpen={showImportWizard}
        onRequestClose={handleCloseImportWizard}
      />
      <Drawer
        onClose={onDesktopClose}
        onOpen={onDesktopOpen}
        open={desktopOpen}
        rootClass="desktop_drawer"
      >
        <div className="nav">
          <button
            onClick={onDesktopClose}
            type="button"
          >
            Close
          </button>
          {renderNavContent()}
        </div>
      </Drawer>
      <Drawer
        onClose={onMobileClose}
        onOpen={onMobileOpen}
        open={mobileOpen}
        rootClass="mobile_drawer"
        variant="temporary"
      >
        <div className="nav">
          <button
            onClick={onMobileClose}
            type="button"
          >
            Close
          </button>
          {renderNavContent()}
        </div>
      </Drawer>
    </>
  );
}

Nav.propTypes = {
  desktopOpen: PropTypes.bool.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  onDesktopClose: PropTypes.func.isRequired,
  onDesktopOpen: PropTypes.func.isRequired,
  onMobileClose: PropTypes.func.isRequired,
  onMobileOpen: PropTypes.func.isRequired,
};

export default Nav;
