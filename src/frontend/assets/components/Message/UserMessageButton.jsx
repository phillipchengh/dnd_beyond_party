import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import User from '../Graphics/User';

import './UserMessageButton.less';

export function UserMessage({ children, onClick }) {
  const container = useRef(null);

  useEffect(() => {
    container?.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, []);

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

UserMessage.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default UserMessage;
