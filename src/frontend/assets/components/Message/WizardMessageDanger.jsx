import React from 'react';
import PropTypes from 'prop-types';

import WizardMessage from './WizardMessage';

import './WizardMessageDanger.less';

export function WizardMessageDanger({ className, children }) {
  return (
    <WizardMessage
      className={`wizard_message_danger ${className}`}
    >
      {children}
    </WizardMessage>
  );
}

WizardMessageDanger.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

WizardMessageDanger.defaultProps = {
  className: '',
};

export default WizardMessageDanger;
