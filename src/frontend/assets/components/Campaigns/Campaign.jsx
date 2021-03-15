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
    // scroll to top when switching to new campaign
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentCampaignId = getCurrentCampaignId(state);

  return (
    <button
      className={`campaign ${currentCampaignId === campaignId ? 'active' : 'inactive'}`}
      onClick={handleSetCurrentCampaign}
      type="button"
    >
      <div className="button_text">
        {getCampaignName(state, campaignId)}
      </div>
    </button>
  );
}

Campaign.propTypes = {
  campaignId: PropTypes.number.isRequired,
};

export default Campaign;
