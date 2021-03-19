import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import User from '../Graphics/User';

import './UserMessage.less';

export function UserMessage({ children }) {
  const container = useRef(null);

  useEffect(() => {
    container?.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, []);

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
};

export default UserMessage;
