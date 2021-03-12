import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Wand from '../Graphics/Wand';

import './WizardMessage.less';

export function WizardMessage({ className, children, scrollIntoView }) {
  const container = useRef(null);

  useEffect(() => {
    if (scrollIntoView) {
      container?.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [scrollIntoView]);

  return (
    <div className={`wizard_message ${className}`} ref={container}>
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
  scrollIntoView: PropTypes.bool,
};

WizardMessage.defaultProps = {
  className: '',
  scrollIntoView: false,
};

export default WizardMessage;
