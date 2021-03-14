import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../Common/Modal';
import ImportWizard from './ImportWizard';

import './ImportWizardInterstitial.less';

export function ImportWizardInterstitial({ isOpen, onRequestClose }) {
  return (
    <Modal
      className="import_wizard_interstitial"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="import_wizard_overlay"
      theme="interstitial"
    >
      <h2 className="header">Import Campaign Wizard</h2>
      <ImportWizard onAbort={onRequestClose} onDone={onRequestClose} />
    </Modal>
  );
}

ImportWizardInterstitial.propTypes = {
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
};

ImportWizardInterstitial.defaultProps = {
  isOpen: false,
  onRequestClose: null,
};

export default ImportWizardInterstitial;
