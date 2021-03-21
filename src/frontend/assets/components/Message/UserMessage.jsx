import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import User from '../Graphics/User';

import useWizardBottomScroll from './useWizardBottomScroll';

import './UserMessage.less';

export function UserMessage({ children, scrollIntoView, scrollToWizardBottom }) {
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
      <div className="user_message">
        <div className="message">
          {children}
        </div>
        <div className="user_wrapper">
          <User />
        </div>
      </div>
      <div className="scroll_to_element" ref={container} />
    </>
  );
}

UserMessage.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  scrollIntoView: PropTypes.bool,
  scrollToWizardBottom: PropTypes.bool,
};

UserMessage.defaultProps = {
  scrollIntoView: false,
  scrollToWizardBottom: false,
};

export default UserMessage;
