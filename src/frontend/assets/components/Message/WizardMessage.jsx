import React from 'react';
import PropTypes from 'prop-types';

import Wand from '../Graphics/Wand';

import './WizardMessage.less';

export function WizardMessage({ className, children }) {
  return (
    <div className={`wizard_message ${className}`}>
      <div className="wand_wrapper">
        <Wand />
      </div>
      <div className="message">
        {children}
      </div>
    </div>
  );
}

WizardMessage.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

WizardMessage.defaultProps = {
  className: '',
};

export default WizardMessage;
