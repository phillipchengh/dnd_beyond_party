import React, { useMemo } from 'react';
import ReactModal from 'react-modal';
import './modal.less';

export function Modal(props) {
  // this should be set outside the function, but react-modal complains inside a test
  const appElement = useMemo(() => document.querySelector('#dnd_beyond_party_app'), []);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ReactModal appElement={appElement} {...props} />;
}

export default Modal;
