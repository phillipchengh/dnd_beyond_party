import React from 'react';
import PropTypes from 'prop-types';

import WizardMessage from './WizardMessage';

import './WizardMessageDanger.less';

export function WizardMessageDanger({ children }) {
  return <WizardMessage className="wizard_message_danger">{children}</WizardMessage>;
}

WizardMessageDanger.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default WizardMessageDanger;
