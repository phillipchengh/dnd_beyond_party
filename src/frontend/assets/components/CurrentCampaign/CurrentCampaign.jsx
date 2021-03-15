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
import WizardHat from '../Graphics/WizardHat';
import Skull from '../Graphics/Skull';

import WizardMessage from '../Message/WizardMessage';
import WizardMessageDanger from '../Message/WizardMessageDanger';

import Tooltip from '../Common/Tooltip';

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
  const [deletedCampaignName, setDeletedCampaignName] = useState(null);

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
    // use the campaign name before we lose it
    setDeletedCampaignName(currentCampaignName);
    dispatch(actions.deleteCurrentCampaign());
    setShowDeleteModal(false);
  };

  const campaignLink = getCurrentCampaignLink(state);

  return (
    <div className="current_campaign">
      <DeleteCampaignModal
        campaignName={currentCampaignName}
        isOpen={showDeleteModal}
        onDelete={handleDelete}
        onRequestClose={handleCloseDeleteModal}
      />
      {!showCurrentCampaign && !deletedCampaignName && (
        <div className="empty_campaign">
          <div className="icon_wrapper">
            <WizardHat />
          </div>
          <WizardMessage>
            <p>
              Select another campaign to view its party.
            </p>
          </WizardMessage>
          <WizardMessage>
            <p>
              Or import another campaign to add to the fun.
            </p>
          </WizardMessage>
        </div>
      )}
      {!showCurrentCampaign && deletedCampaignName && (
        <div className="empty_campaign">
          <div className="icon_wrapper">
            <Skull />
          </div>
          <WizardMessageDanger>
            <p>
              {'Everyone in '}
              <strong className="emphasis">{deletedCampaignName}</strong>
              {' failed their death saves!'}
            </p>
          </WizardMessageDanger>
          <WizardMessageDanger>
            <p>
              Select another campaign to view its party.
            </p>
          </WizardMessageDanger>
          <WizardMessageDanger>
            <p>
              Or import another campaign.
            </p>
          </WizardMessageDanger>
        </div>
      )}
      {showCurrentCampaign && (
        <>
          <div className="title_container">
            {campaignLink && (
              <Tooltip title="View campaign on D&D Beyond">
                <a className="dndbeyond_link" href={getCurrentCampaignLink(state)}>
                  <h2 className="title">{currentCampaignName}</h2>
                  <ExternalLink />
                </a>
              </Tooltip>
            )}
            {!campaignLink && (
              <h2 className="no_link_title">{currentCampaignName}</h2>
            )}
            <Tooltip title={`Delete ${currentCampaignName}`}>
              <button className="delete_button" onClick={handleOpenDeleteModal} type="button">
                <span className="delete_button_text">Delete</span>
                <Skull />
              </button>
            </Tooltip>
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
