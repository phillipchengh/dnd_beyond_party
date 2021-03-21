import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import User from '../Graphics/User';

import useWizardBottomScroll from './useWizardBottomScroll';

import './UserMessageButton.less';

export function UserMessageButton({
  children, onClick, scrollIntoView, scrollToWizardBottom,
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
      <div className="user_message_button">
        <button
          className="user_button"
          onClick={onClick}
          type="button"
        >
          {children}
        </button>
        <div className="user_wrapper">
          <User />
        </div>
      </div>
      <div className="scroll_to_element" ref={container} />
    </>
  );
}

UserMessageButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
  scrollIntoView: PropTypes.bool,
  scrollToWizardBottom: PropTypes.bool,
};

UserMessageButton.defaultProps = {
  scrollIntoView: false,
  scrollToWizardBottom: false,
};

export default UserMessageButton;
