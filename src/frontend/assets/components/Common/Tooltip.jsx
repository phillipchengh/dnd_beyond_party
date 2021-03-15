import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip as MaterialTooltip } from '@material-ui/core';

import './Tooltip.less';

export function Tooltip({
  children, interactive, leaveDelay, leaveTouchDelay, popperClassName, title,
}) {
  return (
    <MaterialTooltip
      arrow
      classes={{
        arrow: 'arrow',
        popper: `popper ${popperClassName}`,
        tooltip: 'tooltip',
      }}
      interactive={interactive}
      leaveDelay={leaveDelay}
      leaveTouchDelay={leaveTouchDelay}
      title={title}
    >
      {children}
    </MaterialTooltip>
  );
}

Tooltip.propTypes = {
  popperClassName: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  interactive: PropTypes.bool,
  leaveDelay: PropTypes.number,
  leaveTouchDelay: PropTypes.number,
  title: PropTypes.string.isRequired,
};

Tooltip.defaultProps = {
  interactive: false,
  leaveDelay: null,
  leaveTouchDelay: null,
  popperClassName: '',
};

export default Tooltip;
