import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import WizardMessage from './WizardMessage';

import './WizardMessageMagic.less';

export function WizardMessageMagic({ children }) {
  // add some ellipsis animation to the loading message
  const [dots, setDots] = useState('.  ');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        switch (prevDots) {
          case '.  ': {
            return '.. ';
          }
          case '.. ': {
            return '...';
          }
          default:
            return '.  ';
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <WizardMessage className="wizard_message_magic" scrollToWizardBottom>
      {`${children}${dots}`}
    </WizardMessage>
  );
}

WizardMessageMagic.propTypes = {
  // must be a string
  children: PropTypes.string.isRequired,
};

export default WizardMessageMagic;
