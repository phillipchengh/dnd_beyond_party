import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ImportWizardInterstitial from '@assets/components/ImportWizard/ImportWizardInterstitial';
import Drawer from '../Common/Drawer';
import NavContent from './NavContent';

import './Nav.less';

export function Nav({
  desktopOpen, mobileOpen, onDesktopClose, onDesktopOpen, onMobileClose, onMobileOpen,
}) {
  const [showImportWizard, setShowImportWizard] = useState(false);

  const handleOpenImportWizard = () => {
    setShowImportWizard(true);
    // the mobile drawer still open when they open the import modal will block that modal
    onMobileClose();
  };

  const handleCloseImportWizard = () => {
    setShowImportWizard(false);
  };

  return (
    <>
      <ImportWizardInterstitial
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
          <NavContent
            onClose={onDesktopClose}
            onImport={handleOpenImportWizard}
          />
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
          <NavContent
            onClose={onMobileClose}
            onImport={handleOpenImportWizard}
          />
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
