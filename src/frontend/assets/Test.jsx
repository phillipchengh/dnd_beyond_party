import { hot } from 'react-hot-loader/root';
import React from 'react';
import PropTypes from 'prop-types';

import './Test.less';

export function Test({ zesty }) {
  return (
    <div>{zesty}</div>
  );
}

Test.propTypes = {
  zesty: PropTypes.string,
};

Test.defaultProps = {
  zesty: 'test3',
};

export default hot(Test);
