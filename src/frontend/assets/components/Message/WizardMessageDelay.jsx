import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import WizardMessage from './WizardMessage';
import WizardMessageLoading from './WizardMessageLoading';

export function WizardMessageDelay({ onDone, children }) {
  const [delaying, setDelaying] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDelaying(false);
      onDone();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onDone]);

  return (
    <>
      {delaying && <WizardMessageLoading />}
      {!delaying && <WizardMessage>{children}</WizardMessage>}
    </>
  );
}

WizardMessageDelay.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onDone: PropTypes.func,
};

WizardMessageDelay.defaultProps = {
  onDone: () => {},
};

export default WizardMessageDelay;
