import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import PartyContext from '@assets/party/Context';

import CloseNavButton from './CloseNavButton';
import Campaigns from '../Campaigns/Campaigns';
import WizardHat from '../Graphics/WizardHat';

import './NavContent.less';

export function NavContent({
  onClose, onImport,
}) {
  const { state } = useContext(PartyContext);

  return (
    <div className="nav_content">
      <div className="campaigns_header_wrapper">
        <h2 className="header">Campaigns</h2>
        <CloseNavButton
          onClick={onClose}
        />
      </div>
      <button
        className="import_button"
        onClick={onImport}
        type="button"
      >
        <div className="button_text">
          <div className="beer_wrapper beer_before">
            <WizardHat />
          </div>
          Import Campaign
        </div>
      </button>
      <Campaigns campaigns={state.campaigns} />
    </div>
  );
}

NavContent.propTypes = {
  onClose: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
};

export default NavContent;
