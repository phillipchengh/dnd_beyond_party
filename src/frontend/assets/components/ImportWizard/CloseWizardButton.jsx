import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '../Common/Tooltip';
import Close from '../Graphics/Close';

import './CloseWizardButton.less';

export function CloseWizardButton({
  onClick,
}) {
  return (
    <Tooltip popperClassName="close_wizard" title="Close Wizard">
      <button
        className="close_wizard_button"
        onClick={onClick}
        type="button"
      >
        <span className="button_text">Close Wizard</span>
        <Close />
      </button>
    </Tooltip>
  );
}

CloseWizardButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CloseWizardButton;
