import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '../Common/Tooltip';
import Close from '../Graphics/Close';

import './CloseNavButton.less';

export function CloseNavButton({
  onClick, className,
}) {
  return (
    <Tooltip title="Close Campaigns">
      <button
        className={`close_nav_button ${className}`}
        onClick={onClick}
        type="button"
      >
        <span className="button_text">Close Campaigns</span>
        <Close />
      </button>
    </Tooltip>
  );
}

CloseNavButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

CloseNavButton.defaultProps = {
  className: '',
};

export default CloseNavButton;
