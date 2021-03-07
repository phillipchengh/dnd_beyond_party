import React from 'react';
import PropTypes from 'prop-types';

import './StatHeader.less';

export function StatHeader({
  bottomBorder, children,
}) {
  return (
    <div className="stat_header_container">
      <h4 className={`stat_header ${bottomBorder ? 'bottom_border' : ''}`}>{children}</h4>
    </div>
  );
}

StatHeader.propTypes = {
  bottomBorder: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

StatHeader.defaultProps = {
  bottomBorder: true,
};

export default StatHeader;
