import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { actions } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';
import {
  getCampaignName,
  getCurrentCampaignId,
} from '@assets/party/selectors';

import './Campaign.less';

export function Campaign({ campaignId }) {
  const { dispatch, state } = useContext(PartyContext);

  const handleSetCurrentCampaign = () => {
    dispatch(actions.setCurrentCampaign(campaignId));
  };

  const currentCampaignId = getCurrentCampaignId(state);

  return (
    <button
      className={`campaign ${currentCampaignId === campaignId ? 'active' : ''}`}
      onClick={handleSetCurrentCampaign}
      type="button"
    >
      {getCampaignName(state, campaignId)}
    </button>
  );
}

Campaign.propTypes = {
  campaignId: PropTypes.number.isRequired,
};

export default Campaign;
