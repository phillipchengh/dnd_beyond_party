import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '../Common/Tooltip';
import Close from '../Graphics/Close';

import './CloseDeleteCampaignModalButton.less';

export function CloseDeleteCampaignModalButton({
  disabled, onClick,
}) {
  return (
    <Tooltip popperClassName="delete_campaign_modal" title="Close modal">
      <button
        className="close_delete_campaign_modal_button"
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <span className="button_text">Close modal</span>
        <Close />
      </button>
    </Tooltip>
  );
}

CloseDeleteCampaignModalButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

CloseDeleteCampaignModalButton.defaultProps = {
  disabled: false,
};

export default CloseDeleteCampaignModalButton;
