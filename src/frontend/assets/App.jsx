import { hot } from 'react-hot-loader/root';
import React from 'react';
import PropTypes from 'prop-types';

import './App.less';

export function App({ zesty }) {
  return (
    <div>{zesty}</div>
  );
}

App.propTypes = {
  zesty: PropTypes.string,
};

App.defaultProps = {
  zesty: 'test3',
};

export default hot(App);
