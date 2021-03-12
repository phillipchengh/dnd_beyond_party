import React from 'react';
import PropTypes from 'prop-types';

export function Toggle({ children, show }) {
  return (
    <>
      {!show && null}
      {show && children}
    </>
  );
}

Toggle.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  show: PropTypes.bool,
};

Toggle.defaultProps = {
  show: true,
};

export default Toggle;
