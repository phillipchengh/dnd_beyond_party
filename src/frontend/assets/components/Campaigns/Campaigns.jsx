import React, { useContext } from 'react';

import { actions } from '@assets/party/ducks';
import PartyContext from '@assets/party/Context';
import {
  getCampaigns,
  getCampaignName,
  getCampaignLastUpdate,
  getCampaignLink,
} from '@assets/party/selectors';

export function Campaigns() {
  const { dispatch, state } = useContext(PartyContext);

  const handleDelete = (campaignId) => () => {
    dispatch(actions.deleteCampaign(campaignId));
  };

  const handleSetCurrentCampaign = (campaignId) => () => {
    dispatch(actions.setCurrentCampaign(campaignId));
  };

  const campaigns = getCampaigns(state);

  return (
    <>
      <h2>Campaigns</h2>
      <ol>
        {Object.keys(campaigns).map((campaignId) => (
          <li key={campaignId}>
            <div><strong>{getCampaignName(state, campaignId)}</strong></div>
            <button onClick={handleSetCurrentCampaign(campaignId)} type="button">
              View
            </button>
            <button onClick={handleDelete(campaignId)} type="button">Delete</button>
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
          </li>
        ))}
      </ol>
    </>
  );
}

export default Campaigns;
