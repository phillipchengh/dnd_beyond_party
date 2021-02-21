import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip as MaterialTooltip } from '@material-ui/core';

import './Tooltip.less';

export function Tooltip({ children, title }) {
  return (
    <MaterialTooltip
      arrow
      classes={{
        arrow: 'arrow',
        tooltip: 'tooltip',
      }}
      title={title}
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
  title: PropTypes.string.isRequired,
};

export default Tooltip;
