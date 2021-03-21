import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Wand from '../Graphics/Wand';

import useWizardBottomScroll from './useWizardBottomScroll';

import './WizardMessage.less';

export function WizardMessage({
  className, children, scrollIntoView, scrollToWizardBottom,
}) {
  const container = useRef(null);

  useEffect(() => {
    if (scrollIntoView) {
      container?.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [scrollIntoView]);

  useWizardBottomScroll(scrollToWizardBottom);

  return (
    <>
      <div className={`wizard_message ${className}`}>
        <div className="wand_wrapper">
          <Wand />
        </div>
        <div className="message">
          {children}
        </div>
      </div>
      <div className="scroll_to_element" ref={container} />
    </>
  );
}

WizardMessage.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  scrollIntoView: PropTypes.bool,
  scrollToWizardBottom: PropTypes.bool,
};

WizardMessage.defaultProps = {
  className: '',
  scrollIntoView: false,
  scrollToWizardBottom: false,
};

export default WizardMessage;
