import React, { useContext } from 'react';

import PartyContext from '@assets/party/Context';
import { updateCurrentCampaign } from '@assets/party/sideEffects';

export function Updater() {
  const context = useContext(PartyContext);

  const handleUpdate = async () => {
    updateCurrentCampaign(context);
  };

  return (
    <button onClick={handleUpdate} type="button">Update Current Campaign</button>
  );
}

export default Updater;
