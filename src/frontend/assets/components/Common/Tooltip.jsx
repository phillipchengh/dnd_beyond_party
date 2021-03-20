import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip as MaterialTooltip } from '@material-ui/core';

import './Tooltip.less';

export function Tooltip({
  children, disableFocusListener, disableHoverListener, disableTouchListener,
  interactive, leaveDelay, leaveTouchDelay, onClose, open, popperClassName, title,
}) {
  const openProp = {};
  if (open !== null) {
    openProp.open = open;
  }

  return (
    <MaterialTooltip
      arrow
      classes={{
        arrow: 'arrow',
        popper: `popper ${popperClassName}`,
        tooltip: 'tooltip',
      }}
      disableFocusListener={disableFocusListener}
      disableHoverListener={disableHoverListener}
      disableTouchListener={disableTouchListener}
      interactive={interactive}
      leaveDelay={leaveDelay}
      leaveTouchDelay={leaveTouchDelay}
      onClose={onClose}
      title={title}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...openProp}
    >
      {children}
    </MaterialTooltip>
  );
}

Tooltip.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  disableFocusListener: PropTypes.bool,
  disableHoverListener: PropTypes.bool,
  disableTouchListener: PropTypes.bool,
  interactive: PropTypes.bool,
  leaveDelay: PropTypes.number,
  leaveTouchDelay: PropTypes.number,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  popperClassName: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

Tooltip.defaultProps = {
  disableFocusListener: false,
  disableHoverListener: false,
  disableTouchListener: false,
  interactive: false,
  leaveDelay: 0,
  leaveTouchDelay: 1500,
  onClose: null,
  open: null,
  popperClassName: '',
};

export default Tooltip;
