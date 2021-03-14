import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import WizardMessage from './WizardMessage';
import WizardMessageLoading from './WizardMessageLoading';

export function WizardMessageDelay({ className, onDone, children }) {
  const [delaying, setDelaying] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (delaying) {
        setDelaying(false);
        onDone();
      }
    }, 1000);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [children, delaying, onDone]);

  return (
    <>
      {delaying && <WizardMessageLoading />}
      {!delaying && <WizardMessage className={className}>{children}</WizardMessage>}
    </>
  );
}

WizardMessageDelay.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onDone: PropTypes.func,
};

WizardMessageDelay.defaultProps = {
  className: '',
  onDone: () => {},
};

export default WizardMessageDelay;
