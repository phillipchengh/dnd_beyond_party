import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip as MaterialTooltip } from '@material-ui/core';

import './Tooltip.less';

export function Tooltip({ children, popperClassName, title }) {
  return (
    <MaterialTooltip
      arrow
      classes={{
        arrow: 'arrow',
        popper: `popper ${popperClassName}`,
        tooltip: 'tooltip',
      }}
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
  title: PropTypes.string.isRequired,
};

Tooltip.defaultProps = {
  popperClassName: '',
};

export default Tooltip;
