import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import ReactModal from 'react-modal';

import './Modal.less';

export function Modal({
  children, className, isOpen, onRequestClose, overlayClassName, theme,
}) {
  // this should be set outside the function, but react-modal complains inside a test
  const appElement = useMemo(() => document.querySelector('#dnd_beyond_party_app'), []);
  return (
    <ReactModal
      appElement={appElement}
      className={`modal ${className} ${theme}`}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={`overlay ${overlayClassName}`}
    >
      {children}
    </ReactModal>
  );
}

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
  overlayClassName: PropTypes.string,
  theme: PropTypes.oneOf(['default', 'interstitial']),
};

Modal.defaultProps = {
  className: '',
  isOpen: false,
  onRequestClose: null,
  overlayClassName: '',
  theme: 'default',
};

export default Modal;
