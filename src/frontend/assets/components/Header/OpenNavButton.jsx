import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '../Common/Tooltip';
import Dungeon from '../Graphics/Dungeon';

import './OpenNavButton.less';

export function OpenNavButton({
  onClick, className,
}) {
  return (
    <Tooltip title="Open Campaigns">
      <button
        className={`open_nav_button ${className}`}
        onClick={onClick}
        type="button"
      >
        <span className="button_text">Open Campaigns</span>
        <Dungeon />
      </button>
    </Tooltip>
  );
}

OpenNavButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

OpenNavButton.defaultProps = {
  className: '',
};

export default OpenNavButton;
