import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Modal from '../Common/Modal';
import BookDead from '../Graphics/BookDead';

import CloseDeleteCampaignModalButton from './CloseDeleteCampaignModalButton';
import WizardMessageDanger from '../Message/WizardMessageDanger';

import './DeleteCampaignModal.less';

export function DeleteCampaignModal({
  campaignName, isOpen, onDelete, onRequestClose,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
  };

  // we need to do it this way because the actions from onDelete might block any css animations
  // start animating first (ensure isDeleting state finishes setting to true), then block
  useEffect(() => {
    if (isDeleting) {
      onDelete();
      setIsDeleting(false);
    }
  }, [isDeleting, onDelete]);

  return (
    <Modal
      className="delete_campaign_modal"
      isOpen={isOpen}
      onRequestClose={!isDeleting ? onRequestClose : null}
    >
      <CloseDeleteCampaignModalButton disabled={isDeleting} onClick={onRequestClose} />
      <h2 className="header">Delete Campaign</h2>
      <BookDead />
      <div className="messages">
        <WizardMessageDanger>
          <p>
            Are you sure you want to TPK your party?
          </p>
        </WizardMessageDanger>
        <WizardMessageDanger>
          <p>
            {'You will need to reimport '}
            <strong className="emphasis">{campaignName}</strong>
            {' if you want to resurrect them.'}
          </p>
        </WizardMessageDanger>
      </div>
      <div className="buttons_wrapper">
        <button
          className={`delete_button ${isDeleting ? 'is_deleting' : ''}`}
          disabled={isDeleting}
          onClick={handleDelete}
          type="button"
        >
          {!isDeleting && 'Delete'}
          {isDeleting && (
            <>
              <span className="loading_dot" />
              <span className="loading_dot" />
              <span className="loading_dot" />
              {/* for unsighted users */}
              <span className="loading_text">Deleting</span>
            </>
          )}
        </button>
        <button
          className="cancel_button"
          disabled={isDeleting}
          onClick={onRequestClose}
          type="button"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}

DeleteCampaignModal.propTypes = {
  campaignName: PropTypes.string,
  isOpen: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func,
};

DeleteCampaignModal.defaultProps = {
  campaignName: 'your campaign',
  isOpen: false,
  onRequestClose: null,
};

export default DeleteCampaignModal;
