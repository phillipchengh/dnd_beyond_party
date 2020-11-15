import React from 'react';
import PropTypes from 'prop-types';

import './Test.less';

export function Test({ zesty }) {
  return (
    <div>{zesty}</div>
  );
}

Test.propTypes = {
  zesty: PropTypes.string.isRequired,
};

export default Test;
