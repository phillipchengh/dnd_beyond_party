import React, { useContext, useState } from 'react';

import PartyContext from '@assets/party/Context';
import { hasCampaigns } from '@assets/party/selectors';

import WelcomeView from './WelcomeView';
import MainView from './MainView';

export function Main() {
  const { state } = useContext(PartyContext);

  const hasNoCampaigns = !hasCampaigns(state);
  // if they have no campaigns, force show them the import wizard
  const [showWelcomeView, setShowWelcomeView] = useState(hasNoCampaigns);

  const handleWelcomeViewDone = () => {
    setShowWelcomeView(false);
  };

  return (
    <>
      {showWelcomeView && <WelcomeView onDone={handleWelcomeViewDone} />}
      {!showWelcomeView && <MainView />}
    </>
  );
}

export default Main;
