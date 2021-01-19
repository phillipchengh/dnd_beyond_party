import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { actions } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';
import {
  getCampaignName,
  getCampaignLastUpdate,
  getCampaignLink,
} from '@assets/party/selectors';

export function Campaign({ campaignId }) {
  const { dispatch, state } = useContext(PartyContext);

  const handleSetCurrentCampaign = () => {
    dispatch(actions.setCurrentCampaign(campaignId));
  };

  const handleDelete = () => {
    dispatch(actions.deleteCampaign(campaignId));
  };

  return (
    <>
      <div><strong>{getCampaignName(state, campaignId)}</strong></div>
      <button onClick={handleSetCurrentCampaign} type="button">
        View
      </button>
      <button onClick={handleDelete} type="button">Delete</button>
      <dl>
        <dt>Campaign ID</dt>
        <dd>{campaignId}</dd>
        <dt>Last Update</dt>
        <dd>{getCampaignLastUpdate(state, campaignId)}</dd>
        {getCampaignLink(state, campaignId) && (
          <>
            <dt>Link</dt>
            <dd><a href={getCampaignLink(state, campaignId)}>Here</a></dd>
          </>
        )}
      </dl>
    </>
  );
}

Campaign.propTypes = {
  campaignId: PropTypes.number.isRequired,
};

export default Campaign;
