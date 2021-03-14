import React, { useContext, useState } from 'react';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import PartyContext from '@assets/party/Context';

import { actions } from '@assets/party/ducks';

import {
  getCurrentCampaignLastUpdate,
  getCurrentCampaignName,
  getCurrentCampaignLink,
  getSortedCurrentCampaignCharacters,
  hasCurrentCampaign,
} from '@assets/party/selectors';

import {
  getId,
} from '@assets/character/calcs';

import Character from './Character';

import DeleteCampaignModal from './DeleteCampaignModal';
import ExternalLink from '../Graphics/ExternalLink';
import Skull from '../Graphics/Skull';

import './CurrentCampaign.less';

export function CurrentCampaign() {
  const { dispatch, state } = useContext(PartyContext);

  const showCurrentCampaign = hasCurrentCampaign(state);
  let currentCampaignLastUpdate;
  let currentCampaignName;
  let currentCampaignCharacters;
  if (showCurrentCampaign) {
    currentCampaignLastUpdate = getCurrentCampaignLastUpdate(state);
    currentCampaignName = getCurrentCampaignName(state);
    currentCampaignCharacters = getSortedCurrentCampaignCharacters(state);
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
    // use the campaign name before we lose it
    setDeleteMessage(`We deleted ${currentCampaignName}!`);
    dispatch(actions.deleteCurrentCampaign());
    setShowDeleteModal(false);
  };

  return (
    <div className="current_campaign">
      <DeleteCampaignModal
        campaignName={currentCampaignName}
        isOpen={showDeleteModal}
        onDelete={handleDelete}
        onRequestClose={handleCloseDeleteModal}
      />
      {!showCurrentCampaign && (
        <>
          {deleteMessage && <p>{deleteMessage}</p>}
          <p>Pick a Current Campaign from the left!</p>
        </>
      )}
      {showCurrentCampaign && (
        <>
          <div className="title_container">
            <a className="dndbeyond_link" href={getCurrentCampaignLink(state)}>
              <h2 className="title">{currentCampaignName}</h2>
              <ExternalLink />
            </a>
            <button className="delete_button" onClick={handleOpenDeleteModal} type="button">
              <span className="delete_button_text">Delete</span>
              <Skull />
            </button>
          </div>
          <p className="last_update_text">
            {`last updated ${formatDistanceToNow(currentCampaignLastUpdate)} ago`}
          </p>
          <ol className="character_list">
            {currentCampaignCharacters.map(({ lastUpdate, data }) => (
              <li className="character_item" key={getId(data)}>
                <Character
                  data={data}
                  lastUpdate={lastUpdate}
                />
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

export default CurrentCampaign;
